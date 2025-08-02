import Typer from "./Typer";
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

function loadingPleaseWait() {
  return async function* (): AsyncGenerator<string> {
    yield "Please wait...\n";
    await delay(1500);

    for (let i = 0; i < 100; i++) {
      yield `\rDownloading - ${i + 1}%`;
      await delay(70);
    }

    yield "\n\nDone!\n\n";
    await delay(500);
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
      generatorFactory={seq(loadingPleaseWait(), letterGenerator(message))}
    />
  );
}

export default App;
