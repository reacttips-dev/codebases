'use strict';

exports.__esModule = true;
var result = function result(fn) {
  return typeof fn === 'function' ? fn() : fn;
};

exports.default = function (cond, ifTrue, ifFalse) {
  return result(cond) ? result(ifTrue) : result(ifFalse);
};

module.exports = exports['default'];