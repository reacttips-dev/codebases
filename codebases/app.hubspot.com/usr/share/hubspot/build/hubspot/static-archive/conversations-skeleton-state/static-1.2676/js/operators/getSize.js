'use es6';

var isNumber = function isNumber(val) {
  return typeof val === 'number';
};

export var getSize = function getSize(value) {
  return isNumber(value) ? value + "px" : value;
};