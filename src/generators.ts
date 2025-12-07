import { delay } from "./util";

export function wordGenerator(message: string) {
  return async function* (): AsyncGenerator<string> {
    const words = message.split(" ");
    for (const word of words) {
      await delay(200);
      yield word + " ";
    }
  };
}

export function letterGenerator(message: string) {
  return async function* (): AsyncGenerator<string> {
    for (const ch of message.split("")) {
      await delay(120);
      yield ch;
    }
  };
}

export function waitFor(ms: number) {
  return async function* (): AsyncGenerator<string> {
    await delay(ms);
    yield "";
  };
}

export function clear(ms: number) {
  return async function* (): AsyncGenerator<string> {
    yield "\nPlease wait...\n";
    await delay(ms);
    yield "\x1b[2J"; // ANSI Clear screen
  };
}

export function reflow(generatorFactory: () => AsyncGenerator<string>) {
  return async function* (): AsyncGenerator<string> {
    for await (const chunk of generatorFactory()) {
      for (const ch of chunk.split("")) {
        await delay(20);
        yield ch;
      }
    }
  };
}

export function think(generatorFactory: () => AsyncGenerator<string>) {
  return async function* (): AsyncGenerator<string> {
    let thinking = false;
    let yieldedThinking = false;
    let count = 0;

    for await (const chunk of generatorFactory()) {
      const lower = chunk.trim().toLowerCase();
      
      if (lower === "<think>") {
        thinking = true;
        yieldedThinking = false;
        continue;
      }

      if (lower === "</think>") {
        thinking = false;
        yieldedThinking = false;
        continue;
      }

      if (thinking) {
        count++;
        if (!yieldedThinking) {
          yield `Thinking...`;
          yieldedThinking = true;
        } else if (count % 20 === 0) {
          yield "."
        }
      } else {
        yield chunk;
      }
    }
  };
}

export function seq(...generatorFactories: Array<() => AsyncGenerator<string>>) {
  return async function* (): AsyncGenerator<string> {
    for (const factory of generatorFactories) {
      for await (const chunk of factory()) {
        yield chunk;
      }
    }
  };
}
