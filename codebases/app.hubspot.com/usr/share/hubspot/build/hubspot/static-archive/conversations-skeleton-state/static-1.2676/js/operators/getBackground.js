'use es6';

import { COLOUR_MAPPINGS, BLANK_BACKGROUND, makeGradientBackground } from '../constants/background';
import { BLANK } from '../constants/useOptions';

var getColourPattern = function getColourPattern(useOption) {
  return COLOUR_MAPPINGS[useOption];
};

export var getBackground = function getBackground(_ref) {
  var use = _ref.use;
  return use === BLANK ? BLANK_BACKGROUND : makeGradientBackground(getColourPattern(use));
};