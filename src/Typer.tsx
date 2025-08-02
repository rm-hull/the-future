import { useState, useEffect } from "react";
import CharTerminal from "./CharTerminal";

type TyperProps = {
  generatorFactory: () => AsyncGenerator<string>;
};

export default function Typer({ generatorFactory }: TyperProps) {
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    setTypedMessage(""); // Reset on generator change
    const generator = generatorFactory();
    async function run() {
      let acc = "";
      for await (const value of generator) {
        if (cancelled) break;
        acc += value;
        setTypedMessage(acc);
      }
    }
    run();

    return () => {
      cancelled = true;
    };
  }, [generatorFactory]);

  return <CharTerminal text={typedMessage} />;
}
