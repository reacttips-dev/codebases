'use es6'; //eslint-disable no-case-declarations

import { PRIMARY, TRANSPARENT_ON_PRIMARY, TRANSPARENT_ON_BACKGROUND } from '../constants/IconButtonUses';
import { adjustLuminance } from '../../utils/adjustLuminance';
import { css } from 'styled-components';
import { hexToRGB } from '../../utils/hexToRGB';
import { getTransparentOnBackgroundIconButtonBackgroundColor, getTransparentOnPrimaryIconButtonBackgroundColor, getIconButtonBackgroundColor, getDisabledIconButtonBackgroundColor, getDisabledIconButtonTextColor, getTransparentOnBackgroundIconButtonTextColor, getTransparentOnPrimaryIconButtonTextColor, getIconButtonTextColor } from '../theme/iconButtonThemeOperators';
export var getHoverBackgroundStyles = function getHoverBackgroundStyles(_ref) {
  var theme = _ref.theme,
      use = _ref.use;

  switch (use) {
    case TRANSPARENT_ON_BACKGROUND:
      {
        var buttonBackgroundColor = getTransparentOnBackgroundIconButtonBackgroundColor(theme);

        var _hexToRGB = hexToRGB(buttonBackgroundColor),
            r = _hexToRGB.r,
            g = _hexToRGB.g,
            b = _hexToRGB.b;

        return css(["background-color:rgba(", ",", ",", ",0.1);"], r, g, b);
      }

    case TRANSPARENT_ON_PRIMARY:
      {
        var _buttonBackgroundColor = getTransparentOnPrimaryIconButtonBackgroundColor(theme);

        var _hexToRGB2 = hexToRGB(_buttonBackgroundColor),
            _r = _hexToRGB2.r,
            _g = _hexToRGB2.g,
            _b = _hexToRGB2.b;

        return css(["background-color:rgba(", ",", ",", ",0.1);"], _r, _g, _b);
      }

    case PRIMARY:
    default:
      {
        var _buttonBackgroundColor2 = getIconButtonBackgroundColor(theme);

        return css(["background-color:", ";"], adjustLuminance(_buttonBackgroundColor2, 20));
      }
  }
};
export var getActiveBackgroundStyles = function getActiveBackgroundStyles(_ref2) {
  var theme = _ref2.theme,
      use = _ref2.use;

  switch (use) {
    case TRANSPARENT_ON_BACKGROUND:
      {
        var buttonBackgroundColor = getTransparentOnBackgroundIconButtonBackgroundColor(theme);

        var _hexToRGB3 = hexToRGB(buttonBackgroundColor),
            r = _hexToRGB3.r,
            g = _hexToRGB3.g,
            b = _hexToRGB3.b;

        return css(["background-color:rgba(", ",", ",", ",0.4);"], r, g, b);
      }

    case TRANSPARENT_ON_PRIMARY:
      {
        var _buttonBackgroundColor3 = getTransparentOnPrimaryIconButtonBackgroundColor(theme);

        var _hexToRGB4 = hexToRGB(_buttonBackgroundColor3),
            _r2 = _hexToRGB4.r,
            _g2 = _hexToRGB4.g,
            _b2 = _hexToRGB4.b;

        return css(["background-color:rgba(", ",", ",", ",0.4);"], _r2, _g2, _b2);
      }

    case PRIMARY:
    default:
      {
        var _buttonBackgroundColor4 = getIconButtonBackgroundColor(theme);

        return css(["background-color:", ";"], adjustLuminance(_buttonBackgroundColor4, -10));
      }
  }
};

var getDisabledBackgroundStyles = function getDisabledBackgroundStyles(_ref3) {
  var theme = _ref3.theme,
      use = _ref3.use;

  switch (use) {
    case TRANSPARENT_ON_BACKGROUND:
    case TRANSPARENT_ON_PRIMARY:
      {
        return css(["background-color:transparent;border:none;"]);
      }

    case PRIMARY:
    default:
      {
        return css(["background-color:", ";border:none;"], getDisabledIconButtonBackgroundColor(theme));
      }
  }
};

export var getBackgroundStyles = function getBackgroundStyles(_ref4) {
  var theme = _ref4.theme,
      use = _ref4.use,
      active = _ref4.active,
      hover = _ref4.hover,
      disabled = _ref4.disabled;

  if (disabled) {
    return getDisabledBackgroundStyles({
      theme: theme,
      use: use
    });
  }

  var stateBackgroundStyles;

  if (active) {
    stateBackgroundStyles = getActiveBackgroundStyles({
      theme: theme,
      use: use
    });
  }

  if (hover) {
    stateBackgroundStyles = getHoverBackgroundStyles({
      theme: theme,
      use: use
    });
  }

  switch (use) {
    case TRANSPARENT_ON_BACKGROUND:
    case TRANSPARENT_ON_PRIMARY:
      {
        return css(["border:none;background-color:transparent;", ""], stateBackgroundStyles);
      }

    case PRIMARY:
    default:
      {
        return css(["background-color:", ";border:none;", ""], getIconButtonBackgroundColor(theme), stateBackgroundStyles);
      }
  }
};
export var getColorStyles = function getColorStyles(_ref5) {
  var theme = _ref5.theme,
      use = _ref5.use,
      disabled = _ref5.disabled;

  if (disabled) {
    return css(["color:", ";"], getDisabledIconButtonTextColor(theme));
  }

  switch (use) {
    case TRANSPARENT_ON_BACKGROUND:
      {
        return css(["color:", ";"], getTransparentOnBackgroundIconButtonTextColor(theme));
      }

    case TRANSPARENT_ON_PRIMARY:
      {
        return css(["color:", ";"], getTransparentOnPrimaryIconButtonTextColor(theme));
      }

    case PRIMARY:
    default:
      {
        return css(["color:", ";"], getIconButtonTextColor(theme));
      }
  }
};