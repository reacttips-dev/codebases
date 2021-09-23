'use es6';

import { getPrimaryColor, getDisabledTextColor, getDisabledBackgroundColor, getTextOnPrimaryColor, setThemeProperty } from '../../theme/defaultThemeOperators';
import { get } from '../../utils/get';
export var getIconButtonBackgroundColor = getPrimaryColor;
export var getIconButtonTextColor = getTextOnPrimaryColor;
export var getTransparentOnPrimaryIconButtonBackgroundColor = getTextOnPrimaryColor;
export var getTransparentOnPrimaryIconButtonTextColor = getTextOnPrimaryColor;
export var getTransparentOnBackgroundIconButtonBackgroundColor = function getTransparentOnBackgroundIconButtonBackgroundColor(theme) {
  return get('transparentOnBackgroundIconButton', theme) || getPrimaryColor(theme);
};
export var getTransparentOnBackgroundIconButtonTextColor = function getTransparentOnBackgroundIconButtonTextColor(theme) {
  return get('transparentOnBackgroundIconButton', theme) || getPrimaryColor(theme);
};
export var setTransparentOnBackgroundIconButton = setThemeProperty('transparentOnBackgroundIconButton');
export var getDisabledIconButtonTextColor = getDisabledTextColor;
export var getDisabledIconButtonBackgroundColor = getDisabledBackgroundColor;