'use es6';

import { getPrimaryColor, getTextColor } from '../../theme/defaultThemeOperators';
import { setThemeProperty } from '../../theme/defaultThemeOperators';
import { get } from '../../utils/get';
import { DEFAULT_HELP_TEXT_COLOR, DEFAULT_ERROR_TEXT_COLOR } from '../../theme/ColorConstants';
export var getLinkTextColor = function getLinkTextColor(theme) {
  return get('linkText', theme) || getPrimaryColor(theme);
};
export var setLinkTextColor = setThemeProperty('linkText');
export var getExternalLinkIconColor = function getExternalLinkIconColor() {
  return DEFAULT_HELP_TEXT_COLOR;
};
export var getOnBrightLinkTextColor = getTextColor;
export var getErrorTextColor = function getErrorTextColor() {
  return DEFAULT_ERROR_TEXT_COLOR;
};