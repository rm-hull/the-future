import React, { useState, useEffect } from "react";
import CharTerminal from "./CharTerminal";

type TyperProps = {
  message: string;
  typingInterval?: number;
};

const Typer: React.FC<TyperProps> = ({ message, typingInterval = 200 }) => {
  const [typedMessage, setTypedMessage] = useState("");

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      if (i < message.length) {
        setTypedMessage(() => message.substring(0, i + 1));
        i++;
      } else {
        clearInterval(intervalId);
      }
    }, typingInterval);

    return () => clearInterval(intervalId);
  }, [message, typingInterval, setTypedMessage]);

  return <CharTerminal text={typedMessage} />;
};

export default Typer;
