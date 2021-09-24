'use es6';

import { getTextColor, useDefaultElementColor } from '../../util/textColorUtils';
import ColoringRecord from 'conversations-internal-schema/coloring/records/ColoringRecord';
export var FIRST_COLOR = '#425b76';
export var SECOND_COLOR = '#00a4bd';
export var THIRD_COLOR = '#b24592';
export var FOURTH_COLOR = '#ff5f6d';
export var FIFTH_COLOR = '#3788d1';
export var DEFAULT_CUSTOM_COLOR = '#3288e6';
export var getBrandStyle = function getBrandStyle(accentColor) {
  switch (accentColor) {
    case FIRST_COLOR:
      return {
        backgroundImage: 'linear-gradient(0deg, #516F90 35%, #293E54 100%)'
      };

    case SECOND_COLOR:
      return {
        backgroundImage: 'linear-gradient(-225deg, #50CCCC 35%, #45AECA 100%)'
      };

    case THIRD_COLOR:
      return {
        backgroundImage: 'linear-gradient(-225deg, #F15F79 35%, #B24592 100%)'
      };

    case FOURTH_COLOR:
      return {
        backgroundImage: 'linear-gradient(-225deg, #FFC371 20%, #FF5F6D 100%)'
      };

    case FIFTH_COLOR:
      return {
        backgroundImage: 'linear-gradient(-225deg, #755DD5 35%, #3788D1 100%)'
      };

    default:
      return {
        backgroundColor: accentColor
      };
  }
};
export function buildColorRecord(accentColor) {
  if (accentColor == null) {
    return new ColoringRecord();
  }

  return new ColoringRecord({
    accentColor: accentColor,
    textColor: getTextColor(accentColor),
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useDefaultColor: useDefaultElementColor(accentColor)
  });
}
export function hexToRgba(hex) {
  var alpha = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result) {
    var red = parseInt(result[1], 16);
    var green = parseInt(result[2], 16);
    var blue = parseInt(result[3], 16);
    return red + ", " + green + ", " + blue + ", " + alpha;
  }

  return null;
}