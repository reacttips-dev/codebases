/**
 * To lighten or darken a color
 *
 * HEX --> RGB --> HSL -->   Change L value   --> RGB --> HEX
 *                          by given shade %
 *
 *
 */

const shades = {
  one: 0.04,
  two: 0.08,
  three: 0.15,
  four: 0.25
},
highlightOpacity = 0.2;


/**
 *
 * @param {*} hex
 */
function hexToHSL (hex) {
  let { r, g, b } = hexToRGB(hex),
    max = 0,
    min = 0;

  r /= 255, g /= 255, b /= 255,
  max = Math.max(r, g, b),
  min = Math.min(r, g, b);

  var h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  }
  else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h, s, l };
}

/**
 * hue to rgb
 */
function _hue2rgb (p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

  return p;
}

/**
 * RGB to HEX
 */
function _rgbToHex (rgb) {
  var hex = Number(rgb).toString(16);
  if (hex.length < 2) {
    hex = '0' + hex;
  }
  return hex;
}

/**
 * HSL to HEX
 */
function hslToHEX (h, s, l) {
  var r, g, b;
  if (l < 0) {
    l = 0;
  }
  if (l > 1) {
    l = 1;
  }
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = _hue2rgb(p, q, h + 1 / 3);
    g = _hue2rgb(p, q, h);
    b = _hue2rgb(p, q, h - 1 / 3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  return `#${_rgbToHex(r)}${_rgbToHex(g)}${_rgbToHex(b)}`;
}

/**
 * Lighten the color by given percentage
 */
export function lighten (color, percentage) {
  let hsl = hexToHSL(color);
  return hslToHEX(hsl.h, hsl.s, hsl.l + percentage);
}

/**
 * Darken the color by given percentage
 */
export function darken (color, percentage) {
  let hsl = hexToHSL(color);
  return hslToHEX(hsl.h, hsl.s, hsl.l - percentage);
}

/**
 * Check if color is perceived as light color
 *  https://en.wikipedia.org/wiki/Luma_(video)
 */
export function isLightColor ({ r, g, b }) {
  (0.2126 * r + 0.7152 * g + 0.0722 * b) > 180;
}

/**
 * Convert hex to hexToRGB
 */
export function hexToRGB (hex) {
  let result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}

/**
 *
 * @param {*} theme - Object of theme colors
 */
export function generateCSSVariables (theme) {
  let cssColorVariables = [];
  for (let key in theme) {
    cssColorVariables.push(`${key}: ${theme[key]};`);
    let { l } = hexToHSL(theme[key]);
    if (_.includes(key, 'accent') || _.includes(key, 'brand')) {
      let { r, g, b } = hexToRGB(theme[key]);
      cssColorVariables.push(`${key}--highlight: rgba(${r}, ${g}, ${b}, ${highlightOpacity});`);
    }
    for (let shade in shades) {
      if (l > 0.50) {
        cssColorVariables.push(`${key}--shade--${shade}: ${darken(theme[key], shades[shade])};`);
      }
      else {
        cssColorVariables.push(`${key}--shade--${shade}: ${lighten(theme[key], shades[shade])};`);
      }
    }
  }

  return cssColorVariables.join('');
}

/**
 * This function iterates through JSON of themed dependent design tokens,
 * populate each key-value pair into a CSS variable syntax and join them
 * into a single string.
 *
 * @param {*} theme - Object of themed design tokens
 */
export function populateThemedDesignTokens (theme) {
  let themedDesignTokens = [];
  for (let key in theme) {
    themedDesignTokens.push(`${key}: ${theme[key]};`);
  }
  return themedDesignTokens.join('');
}
