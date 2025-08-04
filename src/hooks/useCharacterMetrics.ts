import { useEffect, useState } from "react";

type CharacterMetrics = {
  width: number;
  height: number;
  ascent: number;
  descent: number;
  actualHeight: number;
  fontHeight: number;
  error?: string;
};

export function useCharacterMetrics(
  char: string,
  font: string
): CharacterMetrics {
  const [metrics, setMetrics] = useState<CharacterMetrics>({
    width: 0,
    height: 0,
    ascent: 0,
    descent: 0,
    actualHeight: 0,
    fontHeight: 0,
    error: "Unitialized",
  });

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      setMetrics((prev) => ({
        ...prev,
        error: "Failed to get canvas context",
      }));
      return;
    }
    context.font = font;

    const textMetrics = context.measureText(char);

    setMetrics({
      width: textMetrics.width,
      ascent: textMetrics.actualBoundingBoxAscent || 0,
      descent: textMetrics.actualBoundingBoxDescent || 0,
      actualHeight:
        (textMetrics.actualBoundingBoxAscent || 0) +
        (textMetrics.actualBoundingBoxDescent || 0),
      fontHeight:
        (textMetrics.fontBoundingBoxAscent || 0) +
        (textMetrics.fontBoundingBoxDescent || 0),
      height:
        textMetrics.actualBoundingBoxAscent +
          textMetrics.actualBoundingBoxDescent ||
        textMetrics.fontBoundingBoxAscent +
          textMetrics.fontBoundingBoxDescent ||
        parseInt(font), // Parse font size as last resort
    });
  }, [char, font]);

  return metrics;
}
