import { useState, useEffect } from "react";
import Terminal from "./Terminal";

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

  return <Terminal text={typedMessage} />;
}
