'use es6';

import { css } from 'styled-components';
/**
 * @param {('left'|'right')} direction The side to receive semi-circular rounding
 * @return {Function} A styled-components mixin
 */

export var setRibbonRounding = function setRibbonRounding() {
  var direction = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'right';
  return css(["border-radius:", ";box-shadow:0 1px 2px rgba(0,0,0,0.2);padding:", ";"], direction === 'right' ? '20px 6px 6px 20px' : '6px 20px 20px 6px', direction === 'right' ? '0 6px 0 10px' : '0 10px 0 6px');
};