'use es6';
/**
 * Creates an array of elements split into groups the length of `chunkSize`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
export function chunk() {
  var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var chunkSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (!array || !chunkSize) {
    return [];
  }

  var length = array.size || array.length;

  if (length === 0) {
    return [];
  }

  var numberOfChunks = Math.ceil(length / chunkSize);
  return _toConsumableArray(Array(numberOfChunks)).map(function (__, index) {
    return array.slice(index * chunkSize, (index + 1) * chunkSize);
  });
}