'use es6';

import { getTextColor, setThemeProperty } from '../../theme/defaultThemeOperators';
import { get } from '../../utils/get';
export var getCloseButtonColor = function getCloseButtonColor(theme) {
  return get('closeButton', theme) || getTextColor(theme);
};
export var setCloseButtonColor = setThemeProperty('closeButton');