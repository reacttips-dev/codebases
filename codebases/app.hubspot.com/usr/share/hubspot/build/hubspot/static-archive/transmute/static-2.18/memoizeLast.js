"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = memoizeLast;

var _immutable = require("immutable");

/**
 * Like memoize, but only caches the most recent value.
 * It's often useful for caching expensive calculations in react components.
 *
 * @example
 * const sum = memoizeLast((...nums) => nums.reduce((acc, n) => acc + n));
 * sum(List.of(1, 2, 3))
 * //> does work, returns 6
 * sum(List.of(1, 2, 3))
 * //> takes cached value, returns 6
 * sum(List.of(4, 5, 6))
 * //> does work, returns 15
 * sum(List.of(1, 2, 3))
 * //> does work again, returns 6
 *
 * @param  {Function} operation
 * @return {Function}
 */
function memoizeLast(operation) {
  if (operation.length === 1) {
    var prevArg1;
    var prevResult1;
    return function memoizedLast1(arg) {
      if (prevArg1 === undefined || !(0, _immutable.is)(arg, prevArg1)) {
        prevResult1 = operation(arg);
        prevArg1 = arg;
      }

      return prevResult1;
    };
  }

  var prevArgsN;
  var prevResultN;
  return function memoizedLastN() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var argsN = (0, _immutable.Seq)(args);

    if (prevArgsN === undefined || !(0, _immutable.is)(argsN, prevArgsN)) {
      prevResultN = operation.apply(void 0, args);
      prevArgsN = argsN;
    }

    return prevResultN;
  };
}

module.exports = exports.default;