import type { MLCEngine, MLCEngineConfig } from "@mlc-ai/web-llm";
import { delay } from "./util";

async function getLibrary() {
  const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
  return { CreateMLCEngine };
}

let model: MLCEngine | null = null;
let clipMessage =
  " It can take a while when we first visit this page to populate the cache. Later refreshes will become faster.";

export function downloadModel(modelName: string) {
  return async function* (): AsyncGenerator<string> {
    yield `Initializing MLC web-llm`;

    const progressQueue: string[] = [];
    const engineOpts: MLCEngineConfig = {
      initProgressCallback: (progress) => {
        progressQueue.push(progress.text.replace(clipMessage, ""));
      },
    };
    const { CreateMLCEngine } = await getLibrary();

    let done = false;
    const downloadPromise = (async () => {
      model = await CreateMLCEngine(modelName, engineOpts);
      done = true;
    })();

    // Poll for progress updates until done
    while (!done || progressQueue.length > 0) {
      while (progressQueue.length > 0) {
        yield `\r\x1b[2K${progressQueue.shift()!}`;
      }
      if (!done) await delay(50);
    }

    await downloadPromise;
    yield `\n${modelName}: downloaded successfully!\n`;
  };
}

export function systemPrompt(instructions: string, prompt: string) {
  return async function* (): AsyncGenerator<string> {
    if (!model) {
      throw new Error("Model not initialized");
    }

    const response = await model.chat.completions.create({
      messages: [
        { role: "system", content: instructions },
        { role: "user", content: prompt },
      ],
      stream: true,
    });

    for await (const chunk of response) {
      if (chunk.choices.length > 0) {
        const content = chunk.choices[0].delta.content || "";
        await delay(200);
        yield content;
      }
    }
  };
}
