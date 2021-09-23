'use es6';

import dateRegex from '../constants/dateRegex';
export default (function (input) {
  if (typeof input !== 'string') {
    return false;
  }

  return dateRegex.test(input);
});