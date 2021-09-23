'use es6';

import invariant from './invariant';
/**
 * Support increment types
 *
 * @type {string[]}
 * @constant
 */

var SUPPORTED_TYPES = ['string', 'number'];
/**
 * Create incrementor based on initial type
 *
 * @param {number|string} initial Initial value
 * @param {number} [step=1] Increment steps
 * @returns {Function} Incrementor function
 */

export default (function (initial) {
  var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  invariant(SUPPORTED_TYPES.includes(typeof initial), '[increment] expected `initial` value to be type of %s, but got %s', SUPPORTED_TYPES, typeof initial);
  var current = null;
  var next = initial;
  return function () {
    current = next;

    switch (typeof initial) {
      case 'string':
        {
          next = String.fromCharCode(current.charCodeAt(0) + step);
          return current;
        }

      case 'number':
        next = current + step;
        return current;

      default:
        throw new Error('[increment] expected `initial` value to be type of [number, string], ' + ("but got " + typeof initial));
    }
  };
});