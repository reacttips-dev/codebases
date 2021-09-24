'use es6';

import { hexToRGB } from './hexToRGB';
export var adjustLuminance = function adjustLuminance(colorHex, luminanceShiftPercentage) {
  var _hexToRGB = hexToRGB(colorHex),
      r = _hexToRGB.r,
      g = _hexToRGB.g,
      b = _hexToRGB.b;

  var newRedColor = 0 | (1 << 8) + r + (256 - r) * luminanceShiftPercentage / 100;
  var redHex = ("0" + newRedColor.toString(16).substr(1)).substr(-2);
  var newGreenColor = 0 | (1 << 8) + g + (256 - g) * luminanceShiftPercentage / 100;
  var greenHex = ("0" + newGreenColor.toString(16).substr(1)).substr(-2);
  var newBlueColor = 0 | (1 << 8) + b + (256 - b) * luminanceShiftPercentage / 100;
  var blueHex = ("0" + newBlueColor.toString(16).substr(1)).substr(-2);
  return "#" + redHex + greenHex + blueHex;
};