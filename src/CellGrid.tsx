import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  CSSProperties,
} from "react";

type Dimensions = {
  columns: number;
  rows: number;
};

type CellGridProps = {
  message: string;
  onResize?: (dimensions: Dimensions) => void;
};

const containerStyle: CSSProperties = {
  fontSize: 36,
  background: "#242424",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  textTransform: "uppercase",
};

export default function CellGrid({ message, onResize }: CellGridProps) {
  const [dimensions, setDimensions] = useState({
    columns: 0,
    rows: 0,
    cellWidth: 17,
    cellHeight: 36, // Default cell size in pixels
  });

  const updateDimensions = useCallback(() => {
    const columns = Math.ceil(window.innerWidth / dimensions.cellWidth);
    const rows = Math.ceil(window.innerHeight / dimensions.cellHeight);

    setDimensions((prev) => ({ ...prev, columns, rows }));
    onResize?.({ columns, rows });
  }, [dimensions.cellHeight, dimensions.cellWidth]);

  // Calculate how many cells we need based on window size
  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  const rowStyle: CSSProperties = useMemo(
    () => ({
      whiteSpace: "nowrap", // Keep cells in a row
      color: "#FFAA00",
      letterSpacing: "-0.05em",
      width: `${dimensions.columns * dimensions.cellWidth}px`,
      height: `${dimensions.cellHeight}px`,
    }),
    [dimensions]
  );

  return (
    <div style={containerStyle}>
      {Array.from({ length: dimensions.rows }, (_, rowIndex) => (
        <div key={rowIndex} style={rowStyle}>
          {message.slice(
            rowIndex * dimensions.columns,
            (rowIndex + 1) * dimensions.columns
          )}
        </div>
      ))}
    </div>
  );
}
