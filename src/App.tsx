import Typer from "./Typer";
import { downloadModel, systemPrompt } from "./llm";
import instructions from "./prompts/system_prompt.txt?raw";
import theFuture from "./prompts/the_future.txt?raw";
import credits from "./prompts/credits.txt?raw";
import { seq, waitFor, clear, letterGenerator, reflow } from "./generators";

function App() {
  return (
    <Typer
      generatorFactory={seq(
        downloadModel("Llama-3.2-1B-Instruct-q4f16_1-MLC"),
        clear(5000),
        reflow(systemPrompt(instructions, theFuture)),
        waitFor(10000),
        letterGenerator(credits)
      )}
    />
  );
}

export default App;
