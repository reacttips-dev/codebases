const getRGBValuesFromRGBString = (rgbColor: string): number[] | null => {
  const matches = rgbColor.match(/\d{1,3},\s*\d{1,3},\s*\d{1,3}/gi);
  if (matches && matches.length) {
    return matches[0].split(/[,\s]+/).map((x) => parseInt(x, 10));
  }

  return null;
};

// https://stackoverflow.com/a/5624139
const getRGBValuesFromHexString = (hexColor: string): number[] | null => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const hex = hexColor.replace(
    shorthandRegex,
    (m, r, g, b) => `${r}${r}${g}${g}${b}${b}`,
  );
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  return result && result.length
    ? [
        parseInt(result[1], 16), // r
        parseInt(result[2], 16), // g
        parseInt(result[3], 16), // b
      ]
    : null;
};

export const makeRGB = (color: string): number[] | null => {
  if (color[0] === '#') {
    return getRGBValuesFromHexString(color);
  } else if (color.indexOf('rgb') === 0) {
    return getRGBValuesFromRGBString(color);
  } else {
    throw new Error('Must provide a hex, RGB, or RGBA color');
  }
};

export const makeRGBA = (color: string, alpha: number) => {
  if (color.indexOf('rgba') === 0) {
    return color;
  }
  const rgbValues = makeRGB(color);
  if (!rgbValues) {
    return color;
  }

  const [r, g, b] = rgbValues;

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
