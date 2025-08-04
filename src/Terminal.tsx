import { useEffect, useRef, useState } from "react";
import CellGrid from "./CellGrid";

export type TerminalProps = {
  text: string;
};

function isClearScreenSequence(cmd: string) {
  return cmd === "\x1b[2J";
}

function isClearLineSequence(cmd: string) {
  return cmd === "\x1b[2K";
}

function processText(
  text: string,
  columns: number,
  rows: number,
  prevBuffer?: string[][],
  prevCursor?: { row: number; col: number }
) {
  // Initialize buffer
  let buffer: string[][] = prevBuffer
    ? prevBuffer.map((row) => [...row])
    : Array.from({ length: rows }, () => Array(columns).fill(" "));
  let cursor = prevCursor ? { ...prevCursor } : { row: 0, col: 0 };

  for (let i = 0; i < text.length; i++) {
    if (isClearScreenSequence(text.substring(i, i + 4))) {
      buffer = Array.from({ length: rows }, () => Array(columns).fill(" "));
      cursor = { row: 0, col: 0 };
      i += 3;
      continue;
    }

    if (isClearLineSequence(text.substring(i, i + 4))) {
      buffer[cursor.row] = Array(columns).fill(" ");
      cursor.col = 0;
      i += 3;
      continue;
    }

    const char = text[i];
    if (char === "\n") {
      cursor.row++;
      cursor.col = 0;
      if (cursor.row >= rows) {
        // Scroll up
        buffer = [...buffer.slice(1), Array(columns).fill(" ")];
        cursor.row = rows - 1;
      }
    } else if (char === "\r") {
      cursor.col = 0;
    } else {
      buffer[cursor.row][cursor.col] = char;
      cursor.col++;
      if (cursor.col >= columns) {
        cursor.col = 0;
        cursor.row++;
        if (cursor.row >= rows) {
          buffer = [...buffer.slice(1), Array(columns).fill(" ")];
          cursor.row = rows - 1;
        }
      }
    }
  }
  return { buffer, cursor };
}

export default function Terminal({ text }: TerminalProps) {
  const [dimensions, setDimensions] = useState({ columns: 0, rows: 0 });
  const [buffer, setBuffer] = useState<string[][]>([]);
  const [cursor, setCursor] = useState<{ row: number; col: number }>({
    row: 0,
    col: 0,
  });
  const prevTextRef = useRef("");

  // Process text into buffer
  useEffect(() => {
    if (dimensions.columns === 0 || dimensions.rows === 0) return;
    // Only process new text
    const newText = text.slice(prevTextRef.current.length);
    const result = processText(
      newText,
      dimensions.columns,
      dimensions.rows,
      buffer.length === dimensions.rows &&
        buffer[0]?.length === dimensions.columns
        ? buffer
        : undefined,
      cursor
    );
    setBuffer(result.buffer);
    setCursor(result.cursor);
    prevTextRef.current = text;
  }, [text, dimensions]);

  // Flatten buffer to string for CellGrid
  const message = buffer.length
    ? buffer.map((row) => row.join("")).join("")
    : "";

  return <CellGrid message={message} onResize={setDimensions} cursor={cursor} />;
}
