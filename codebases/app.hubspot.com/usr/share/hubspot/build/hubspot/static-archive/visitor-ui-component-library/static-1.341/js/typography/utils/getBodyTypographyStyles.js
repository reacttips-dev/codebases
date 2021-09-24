'use es6';

import { css } from 'styled-components';
import { getTextColor } from '../../theme/defaultThemeOperators';
export var getBodyTypographyStyles = function getBodyTypographyStyles(_ref) {
  var theme = _ref.theme;
  return css(["font-family:Helvetica,Arial,sans-serif;font-weight:400;font-size:14px;color:", ";line-height:24px;"], getTextColor(theme));
};