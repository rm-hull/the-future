import { useCallback, useEffect, useState } from "react";

type CellGridProps = {
  message: string;
};

export default function CellGrid({ message }: CellGridProps) {
  const [dimensions, setDimensions] = useState({
    columns: 0,
    rows: 0,
    cellWidth: 32,
    cellHeight: 44, // Default cell size in pixels
  });

  const [cells, setCells] = useState<string[]>([]);
  const updateDimensions = useCallback(() => {
    const columns = Math.ceil(window.innerWidth / dimensions.cellWidth);
    const rows = Math.ceil(window.innerHeight / dimensions.cellHeight);

    setDimensions((prev) => ({ ...prev, columns, rows }));
  }, [dimensions.cellHeight, dimensions.cellWidth]);

  // Calculate how many cells we need based on window size
  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // Generate cells when dimensions change
  useEffect(() => {
    const { columns, rows } = dimensions;
    const totalCells = columns * rows;

    const newCells = message
      .replace(/ /g, "_")
      .padEnd(totalCells, "_")
      .toUpperCase();

    setCells([...newCells]);
  }, [dimensions, message, setCells]);

  const containerStyle = {
    fontSize: 64,
    background: "#242424",
    width: "100%",
    height: "100%",
    overflow: "hidden",
  };

  const rowStyle = {
    whiteSpace: "nowrap", // Keep cells in a row
    backgroundColor: "#FFAA00",
    letterSpacing: "-0.05em",
  };

  return (
    <div style={containerStyle}>
      {Array.from({ length: dimensions.rows }, (_, rowIndex) => (
        <div key={rowIndex} style={rowStyle}>
          {cells.slice(
            rowIndex * dimensions.columns,
            (rowIndex + 1) * dimensions.columns
          )}
        </div>
      ))}
    </div>
  );
}
