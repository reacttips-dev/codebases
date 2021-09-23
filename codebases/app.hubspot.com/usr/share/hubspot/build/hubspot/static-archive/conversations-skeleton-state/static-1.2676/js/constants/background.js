'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _COLOUR_MAPPINGS;

import { GYPSUM, KOALA, OLAF, HEFFALUMP, SLINKY } from 'HubStyleTokens/colors';
import { DEFAULT, DARK, SHADE } from './useOptions';
export var COLOUR_MAPPINGS = (_COLOUR_MAPPINGS = {}, _defineProperty(_COLOUR_MAPPINGS, DEFAULT, {
  primary: GYPSUM,
  secondary: KOALA
}), _defineProperty(_COLOUR_MAPPINGS, SHADE, {
  primary: KOALA,
  secondary: GYPSUM
}), _defineProperty(_COLOUR_MAPPINGS, DARK, {
  primary: HEFFALUMP,
  secondary: SLINKY
}), _COLOUR_MAPPINGS);
export var BLANK_BACKGROUND = "\n  background: " + OLAF + ";\n";
export var makeGradientBackground = function makeGradientBackground(_ref) {
  var primary = _ref.primary,
      secondary = _ref.secondary;
  return "\n  background: " + primary + ";\n  background: linear-gradient(to right, " + primary + ", " + secondary + " 20%, " + primary + " 40%);\n  background-size: 1200px;\n";
};