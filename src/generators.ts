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
      await delay(150);
      yield ch;
    }
  };
}

export function waitFor(ms: number) {
  return async function* (): AsyncGenerator<string> {
    await delay(ms);
  };
}

export function clear(ms: number) {
  return async function* (): AsyncGenerator<string> {
    yield "\nPlease wait...\n";
    await delay(ms);
    yield "\x1b[2J"; // ANSI Clear screen
  };
}

export function seq(
  ...generatorFactories: Array<() => AsyncGenerator<string>>
) {
  return async function* (): AsyncGenerator<string> {
    for (const factory of generatorFactories) {
      for await (const chunk of factory()) {
        yield chunk;
      }
    }
  };
}
