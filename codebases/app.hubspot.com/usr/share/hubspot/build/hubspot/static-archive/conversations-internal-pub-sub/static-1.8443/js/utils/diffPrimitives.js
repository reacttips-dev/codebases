'use es6';
/**
 * Diff arrays of primitive values (numbers, strings, booleans, undefined, null, and symbols)
 *
 * @param {Array} array Array to inspect
 * @param {Array} values Values to exclude
 * @returns {Array} Returns an array of filtered values
 */

export var diffPrimitives = function diffPrimitives(a, b) {
  return a.filter(function (x) {
    return !b.includes(x);
  });
};