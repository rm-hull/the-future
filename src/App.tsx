import Typer from "./Typer";
import { downloadModel } from "./llm";
import message from "./ode_to_robert.txt?raw";
import { delay } from "./util";

// function wordGenerator(message: string) {
//   return async function* (): AsyncGenerator<string> {
//     const words = message.split(" ");
//     for (const word of words) {
//       await delay(200);
//       yield word + " ";
//     }
//   };
// }

function letterGenerator(message: string) {
  return async function* (): AsyncGenerator<string> {
    for (const ch of message.split("")) {
      await delay(150);
      yield ch;
    }
  };
}

function clear(ms: number) {
  return async function* (): AsyncGenerator<string> {
    yield "Please wait...\n";
    await delay(ms);
    yield "\x1b[2J"; // ANSI Clear screen
  };
}

function seq(...generatorFactories: Array<() => AsyncGenerator<string>>) {
  return async function* (): AsyncGenerator<string> {
    for (const factory of generatorFactories) {
      for await (const chunk of factory()) {
        yield chunk;
      }
    }
  };
}

function App() {
  return (
    <Typer
      generatorFactory={seq(
        downloadModel("Llama-3.2-1B-Instruct-q4f16_1-MLC"),
        clear(5000),
        letterGenerator(message)
      )}
    />
  );
}

export default App;
