/**
 * Default reject function
 *
 * @param {Error} error Error object
 * @returns {object} Wrapped error
 * @private
 */
var defaultReject = function defaultReject(error) {
  return {
    error: error
  };
};
/**
 * Failable decorator
 *
 * @param {function} callback Failable function
 * @param {?function} reject Rejection function
 * @returns {function} Safely wrapped function
 */


export var safe = function safe(callback) {
  var reject = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultReject;
  return function () {
    try {
      return callback.apply(void 0, arguments);
    } catch (error) {
      return reject(error);
    }
  };
};