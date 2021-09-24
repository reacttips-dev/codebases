'use es6';

import { css } from 'styled-components';
import { adjustLuminance } from '../../utils/adjustLuminance';
import { getLinkTextColor } from '../theme/linkThemeOperators';
export var getLinkHoverStyles = function getLinkHoverStyles(color) {
  return css(["color:", ";text-decoration:underline;"], adjustLuminance(color, -30));
};
export var getLinkActiveStyles = function getLinkActiveStyles(color) {
  return css(["color:", ";"], adjustLuminance(color, 30));
};
export var getLinkStyles = function getLinkStyles(_ref) {
  var color = _ref.color,
      active = _ref.active,
      hover = _ref.hover;
  return css(["cursor:pointer;text-decoration:none;transition:all.15s ease-out;color:", ";font-weight:400;", ";", ";:hover{", ";}:active{", ";}:focus{outline:0;}"], color, active ? getLinkActiveStyles(color) : null, hover ? getLinkHoverStyles(color) : null, getLinkHoverStyles(color), getLinkActiveStyles(color));
};
export var getGlobalLinkStyles = css(["a{", ";}"], function (_ref2) {
  var theme = _ref2.theme;
  return getLinkStyles({
    color: getLinkTextColor(theme)
  });
});