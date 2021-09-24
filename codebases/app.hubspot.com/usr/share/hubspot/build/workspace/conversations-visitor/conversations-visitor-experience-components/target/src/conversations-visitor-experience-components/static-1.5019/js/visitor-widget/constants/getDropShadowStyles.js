'use es6';

import { css } from 'styled-components';
export var getDropShadowStyles = function getDropShadowStyles() {
  return css(["box-shadow:0 1px 6px rgba(0,0,0,0.1),0 2px 24px rgba(0,0,0,0.2);:hover{box-shadow:0 2px 10px rgba(0,0,0,0.2),0 4px 28px rgba(0,0,0,0.3);}:focus{box-shadow:0 2px 10px rgba(0,0,0,0.2),0 4px 28px rgba(0,0,0,0.3);}:active{box-shadow:0 3px 15px rgba(0,0,0,0.3),0 6px 32px rgba(0,0,0,0.4);}"]);
};