'use es6';

import { cloneElement } from 'react';
export default (function (child, props) {
  return child ? /*#__PURE__*/cloneElement(child, props) : null;
});