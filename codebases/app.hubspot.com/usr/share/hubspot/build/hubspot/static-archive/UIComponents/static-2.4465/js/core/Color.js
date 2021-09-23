'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { isNaN } from '../utils/underscore';
var RGB_REGEX = /^rgb/i;
/**
 * Returns the RGB channel values for a given color
 * @param {string} color - A color in hex, rgb(), or rgba() format
 * @returns {object} An object of the form { r, g, b }
 */

export function getRGB(color) {
  var r;
  var g;
  var b;

  try {
    if (RGB_REGEX.test(color)) {
      var match = color.match(/(\d+)\D+(\d+)\D+(\d+)/);
      r = parseInt(match[1], 10);
      g = parseInt(match[2], 10);
      b = parseInt(match[3], 10);
    } else {
      var hexColor = color.toLowerCase().replace(/^#/, '');
      if (hexColor.length === 3) hexColor = hexColor.replace(/([0-9a-f])/g, '$1$1');
      r = parseInt(hexColor.substring(0, 2), 16);
      g = parseInt(hexColor.substring(2, 4), 16);
      b = parseInt(hexColor.substring(4, 6), 16);
    }

    if ([r, g, b].some(isNaN)) return {};
  } catch (err) {
    return {};
  }

  return {
    r: r,
    g: g,
    b: b
  };
}
/**
 * @param {string} color - A color in hex, rgb(), or rgba() format
 * @param {number} opacity - A number between 0 (transparent) and 1 (opaque)
 * @returns {string} A string of the form "rgba(255, 150, 51, 0.75)"
 */

export function rgba(color) {
  var opacity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var _getRGB = getRGB(color),
      r = _getRGB.r,
      g = _getRGB.g,
      b = _getRGB.b;

  return "rgba(" + r + ", " + g + ", " + b + ", " + opacity + ")";
} // https://www.w3.org/TR/WCAG21/#dfn-relative-luminance

function getLuminance(hex) {
  var _getRGB2 = getRGB(hex),
      rRaw = _getRGB2.r,
      gRaw = _getRGB2.g,
      bRaw = _getRGB2.b;

  var r = rRaw / 255.0;
  var rLuminance = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  var g = gRaw / 255.0;
  var gLuminance = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  var b = bRaw / 255.0;
  var bLuminance = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * rLuminance + 0.7152 * gLuminance + 0.0722 * bLuminance;
} // https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio


function getTextContrastRatio() {
  for (var _len = arguments.length, colors = new Array(_len), _key = 0; _key < _len; _key++) {
    colors[_key] = arguments[_key];
  }

  var _colors$map$sort = colors.map(getLuminance).sort(function (a, b) {
    return b - a;
  }),
      _colors$map$sort2 = _slicedToArray(_colors$map$sort, 2),
      lighterColorLuminance = _colors$map$sort2[0],
      darkerColorLuminance = _colors$map$sort2[1];

  return (lighterColorLuminance + 0.05) / (darkerColorLuminance + 0.05);
} // https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html


var AA_CONTRAST_THRESHOLD = '4.5';
export function canReadText(backgroundColor, textColor) {
  var threshold = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : AA_CONTRAST_THRESHOLD;
  return getTextContrastRatio(backgroundColor, textColor) >= threshold;
}