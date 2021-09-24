'use es6';

import Raven from 'Raven';
import HexCodePattern from 'PatternValidationJS/patterns/HexCode'; // shimmed as we cannot depend on HubStyleTokens

var OLAF = '#ffffff';
var OBSIDIAN = '#33475b';
var SHORTHAND_HEX_PATTERN = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
var REGULAR_HEX_PATTERN = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
export function hexToRgb(hex) {
  var rgbObject;

  try {
    var regularHex = hex.replace(SHORTHAND_HEX_PATTERN, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });
    var result = REGULAR_HEX_PATTERN.exec(regularHex);
    rgbObject = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  } catch (error) {
    Raven.captureMessage('HEX_TO_RGB_ERROR', {
      extra: {
        error: error,
        hex: hex
      }
    });
    rgbObject = {
      r: 0,
      g: 0,
      b: 0
    };
  }

  return rgbObject;
}

function getLightness(hex) {
  var _hexToRgb = hexToRgb(hex),
      rRaw = _hexToRgb.r,
      gRaw = _hexToRgb.g,
      bRaw = _hexToRgb.b;

  var r = rRaw / 255.0;
  var rLightness = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
  var g = gRaw / 255.0;
  var gLightness = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
  var b = bRaw / 255.0;
  var bLightness = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
  return 0.2126 * rLightness + 0.7152 * gLightness + 0.0722 * bLightness;
}

export function canReadText(backgroundHex, textColor) {
  var backLightness = getLightness(backgroundHex);
  var textLightness = getLightness(textColor);
  var contrastRatio = (textLightness + 0.05) / (backLightness + 0.05);
  return contrastRatio > 2.0;
}
var canReadTextVal;
var lastAccent;

function getCanReadTextOnce(accent) {
  if (accent !== lastAccent) {
    lastAccent = accent;
    canReadTextVal = canReadText(accent, OLAF);
  }

  return canReadTextVal;
}

export function getTextColor(accent) {
  if (!HexCodePattern.test(accent)) {
    return OBSIDIAN;
  }

  return getCanReadTextOnce(accent) ? OLAF : OBSIDIAN;
}
export function useDefaultElementColor(accent) {
  if (!HexCodePattern.test(accent)) {
    return true;
  }

  return !getCanReadTextOnce(accent);
}