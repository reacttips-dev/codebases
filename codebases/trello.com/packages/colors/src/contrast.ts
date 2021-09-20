import { makeRGB } from './conversion';

// https://stackoverflow.com/a/1855903
export const useLightText = (color: string): boolean => {
  const rgbValues = makeRGB(color);
  if (!rgbValues) {
    return false;
  }

  // https://en.wikipedia.org/wiki/Relative_luminance
  const [r, g, b] = rgbValues;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  return luminance <= 0.4623475;
};
