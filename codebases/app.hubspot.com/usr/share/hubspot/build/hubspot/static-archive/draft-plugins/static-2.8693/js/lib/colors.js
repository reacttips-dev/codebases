'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
export var STYLE_DELINEATOR = '|$|';
export var getHexToStyle = function getHexToStyle(cssProperty) {
  return function (hex) {
    return "" + cssProperty + STYLE_DELINEATOR + hex;
  };
};
export var styleToHex = function styleToHex(style) {
  var _style$split = style.split(STYLE_DELINEATOR),
      _style$split2 = _slicedToArray(_style$split, 2),
      __property = _style$split2[0],
      hex = _style$split2[1];

  return hex;
};