import Typer from "./Typer";
import { downloadModel, systemPrompt } from "./llm";
import instructions from "./prompts/system_prompt.txt?raw";
import theFuture from "./prompts/the_future.txt?raw";
import credits from "./prompts/credits.txt?raw";
import { seq, waitFor, clear, letterGenerator, reflow } from "./generators";

const DEFAULT_MODEL = "Llama-3.2-3B-Instruct-q4f32_1-MLC";

function App() {
  const path = window.location.pathname || "";
  const [, pathModel] = path.match(/\/the-future\/(.+)/) ?? [];
  const model = pathModel ?? DEFAULT_MODEL;

  return (
    <Typer
      generatorFactory={seq(
        downloadModel(model),
        clear(5000),
        reflow(systemPrompt(instructions, theFuture)),
        waitFor(10000),
        letterGenerator(credits)
      )}
    />
  );
}

export default App;
