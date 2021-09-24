'use es6'; // NOTE: Implement InvariantViolation exception with frame popping

/**
 * Development environment error
 *
 * @param {string} format Message format string
 * @param {...string} args Format tokens
 * @returns {Error} Invariant error
 * @private
 */

var getDevelopmentError = function getDevelopmentError(format) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var index = 0;
  var error = new Error(format.replace(/%s/g, function () {
    return String(args[index++]);
  }));
  error.name = 'Invariant Violation';
  return error;
};
/**
 * Invariant violation check
 *
 * @param {boolean} condition Condition to check
 * @param {string} format Message format string
 * @param {...string} args Format tokens
 * @returns {void}
 * @throws Invariant Violation
 */


export default (function (condition, format) {
  if (!condition) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    var error = typeof format === 'string' ? getDevelopmentError.apply(void 0, [format].concat(args)) : new Error('invariant(...): Second argument must be a string.');
    throw error;
  }
});