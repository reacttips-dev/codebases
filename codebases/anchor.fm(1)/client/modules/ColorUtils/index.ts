export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const getWeightedAverage = (n1: number, n2: number, ratio: number): number =>
  Math.max(0, Math.min(255, Math.round(n1 * ratio + n2 * (1 - ratio))));

export function mixRbg(
  color1: RGBColor,
  color2: RGBColor,
  ratioOfColor1: number = 0.5
) {
  if (ratioOfColor1 < 0 || ratioOfColor1 > 1) {
    throw new Error(`Ratio must be between 0 and 1: ${ratioOfColor1}`);
  }
  if (ratioOfColor1 === 1) {
    return color1;
  }
  if (ratioOfColor1 === 0) {
    return color2;
  }
  return {
    r: getWeightedAverage(color1.r, color2.r, ratioOfColor1),
    g: getWeightedAverage(color1.g, color2.g, ratioOfColor1),
    b: getWeightedAverage(color1.b, color2.b, ratioOfColor1),
  };
}

export function hexToRgb(rawHex: string): RGBColor | null {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hex = rawHex.replace(
    shorthandRegex,
    (m, r, g, b) => r + r + g + g + b + b
  );

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export const rgbToRgbaString = (rgb: RGBColor, opacity: number = 1): string =>
  `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;

export const hexToRgba = (hex: string, opacity: number = 1): string => {
  const object = hexToRgb(hex);
  return object
    ? rgbToRgbaString(object, opacity)
    : rgbToRgbaString({ r: 0, g: 0, b: 0 }, 0);
};
