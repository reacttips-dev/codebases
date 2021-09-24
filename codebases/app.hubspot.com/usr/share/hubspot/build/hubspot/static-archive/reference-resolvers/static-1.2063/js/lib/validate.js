'use es6';

import isNumber from 'transmute/isNumber';
export var validateNumericId = function validateNumericId(id) {
  var numericId = parseInt(id, 10);
  return isNumber(numericId);
};