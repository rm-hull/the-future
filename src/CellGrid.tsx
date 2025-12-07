import { useCallback, useEffect, useMemo, useState, CSSProperties } from "react";
import { useCharacterMetrics } from "./hooks/useCharacterMetrics";

type Dimensions = {
  columns: number;
  rows: number;
};

type CellGridProps = {
  message: string;
  onResize?: (dimensions: Dimensions) => void;
  cursor?: { row: number; col: number };
};

const WIDTH_RATIO = 0.623; // Adjusted width ratio for better fit
const HEIGHT_RATIO = 0.85; // Adjusted height ratio for better fit

const containerStyle: CSSProperties = {
  top: 0,
  position: "fixed",
  fontSize: 36,
  background: "#242424",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  textTransform: "uppercase",
};

export default function CellGrid({ message, onResize, cursor }: CellGridProps) {
  const charMetrics = useCharacterMetrics("A", "36px vt220");
  const [dimensions, setDimensions] = useState({
    columns: 0,
    rows: 0,
  });

  const updateDimensions = useCallback(() => {
    if (!charMetrics.width || !charMetrics.height) {
      console.warn("Character metrics not available yet");
      return;
    }
    const columns = Math.trunc(window.innerWidth / (charMetrics.width * WIDTH_RATIO));
    const rows = Math.trunc(window.innerHeight / (charMetrics.fontHeight * HEIGHT_RATIO));

    setDimensions((prev) => ({ ...prev, columns, rows }));
    onResize?.({ columns, rows });
  }, [charMetrics.width, charMetrics.height, charMetrics.fontHeight, onResize]);

  // Calculate how many cells we need based on window size
  useEffect(() => {
    queueMicrotask(updateDimensions);
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  const rowStyle: CSSProperties = useMemo(
    () => ({
      whiteSpace: "nowrap", // Keep cells in a row
      color: "#FFAA00",
      letterSpacing: "-0.05em",
      width: `${dimensions.columns * charMetrics.width * WIDTH_RATIO}px`,
      height: `${charMetrics.fontHeight * HEIGHT_RATIO}px`,
    }),
    [dimensions.columns, charMetrics.width, charMetrics.fontHeight]
  );

  return (
    <div style={containerStyle}>
      {Array.from({ length: dimensions.rows }, (_, rowIndex) => (
        <div key={rowIndex} style={rowStyle}>
          {message.slice(rowIndex * dimensions.columns, (rowIndex + 1) * dimensions.columns)}
        </div>
      ))}
      {cursor && (
        <span
          style={{
            position: "fixed",
            top: cursor.row * (charMetrics.fontHeight * HEIGHT_RATIO),
            left: cursor.col * charMetrics.width * WIDTH_RATIO,
            width: charMetrics.width * WIDTH_RATIO,
            height: charMetrics.fontHeight * HEIGHT_RATIO - 4,
            backgroundColor: "#FFAA00",
            opacity: 0.5,
            animation: "blink 1s step-end infinite",
          }}
        ></span>
      )}
    </div>
  );
}
