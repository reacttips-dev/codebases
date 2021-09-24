'use es6';

var exponentFormat = /^[0-9]\.?[0-9]*[eE][0-9]+/;
var redundantDecimalFormat = /\.0$/;

var isInvalidNumberFormat = function isInvalidNumberFormat(num) {
  var numStr = String(num);
  return exponentFormat.exec(numStr) || redundantDecimalFormat.exec(numStr);
};

export var formatForScientificNotation = function formatForScientificNotation(value) {
  if (isNaN(value) || value === null || value === '' || !isInvalidNumberFormat(value)) {
    return value;
  }

  return typeof value === 'string' ? String(Number(value)) : Number(value);
};