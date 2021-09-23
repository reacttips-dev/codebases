'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { curryable } from '../utils/curryable';
export var getThemeProperty = curryable(function (key, theme) {
  if (typeof theme !== 'object' || theme === null) {
    throw new Error("Error getting '" + key + "': the theme for VizExComponents has not been defined. Please provide a theme through the component props or styled-components ThemeProvider.");
  }

  if (!theme[key]) {
    throw new Error("Error getting '" + key + "': the property was not defined on theme.");
  }

  return theme[key];
});
export var setThemeProperty = curryable(function (key, value, theme) {
  return Object.assign({}, theme, _defineProperty({}, key, value));
});
export var getPrimaryColor = getThemeProperty('primary');
export var setPrimaryColor = setThemeProperty('primary');
export var getTextColor = getThemeProperty('text');
export var setTextColor = setThemeProperty('text');
export var getTextOnPrimaryColor = getThemeProperty('textOnPrimary');
export var setTextOnPrimaryColor = setThemeProperty('textOnPrimary');
export var getErrorTextColor = getThemeProperty('errorText');
export var setErrorTextColor = setThemeProperty('errorText');
export var getDisabledBackgroundColor = getThemeProperty('disabledBackground');
export var setDisabledBackgroundColor = setThemeProperty('disabledBackground');
export var getDisabledTextColor = getThemeProperty('disabledText');
export var setDisabledTextColor = setThemeProperty('disabledText');
export var setPlaceholderTextColor = setThemeProperty('placeholderText');
export var getPlaceholderTextColor = getThemeProperty('placeholderText');
export var getInputBorderColor = getThemeProperty('inputBorder');
export var setInputBorderColor = setThemeProperty('inputBorder');
export var getInputBackgroundColor = getThemeProperty('inputBackground');
export var setInputBackgroundColor = setThemeProperty('inputBackground');
export var setHelpTextColor = setThemeProperty('helpText');
export var getHelpTextColor = getThemeProperty('helpText');