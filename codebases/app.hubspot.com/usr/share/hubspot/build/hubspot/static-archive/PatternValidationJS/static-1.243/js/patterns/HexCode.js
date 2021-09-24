'use es6';

import BasePatternFactory from '../lib/BasePatternFactory';
import HexCodeRegex from '../regex/HexCodeRegex';
var HexCodePattern = BasePatternFactory({
  name: 'HexCode',
  validator: function validator(input) {
    return HexCodeRegex.test(input);
  }
});

HexCodePattern.toRGB = function (input) {
  var matchedGroups = HexCodeRegex.exec(input);
  var RGB = null;

  if (matchedGroups && matchedGroups.length === 7) {
    if (matchedGroups[1] !== undefined) {
      RGB = {
        r: parseInt(matchedGroups[1], 16),
        g: parseInt(matchedGroups[2], 16),
        b: parseInt(matchedGroups[3], 16)
      };
    }

    if (matchedGroups[4] !== undefined) {
      RGB = {
        r: parseInt(matchedGroups[4] + matchedGroups[4], 16),
        g: parseInt(matchedGroups[5] + matchedGroups[5], 16),
        b: parseInt(matchedGroups[6] + matchedGroups[6], 16)
      };
    }
  }

  return RGB;
};

export default HexCodePattern;