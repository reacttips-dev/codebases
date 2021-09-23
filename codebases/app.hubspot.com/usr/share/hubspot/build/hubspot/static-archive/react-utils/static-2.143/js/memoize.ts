/**
 * Returns a wrapper function that, when called, either:
 *
 * 1. Returns the last cached result from `func` for the given arg, or
 * 2. If no cached result is available, calls through to `func`
 *
 * Cache lookups are performed by stringifying the first arg to the function. All other args are
 * ignored for caching purposes.
 *
 * @param {Function} func
 * @returns {Function}
 */
export default function memoize(func) {
  var cache = Object.create(null);
  return function (firstArg) {
    if (!cache[firstArg]) {
      for (var _len = arguments.length, otherArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        otherArgs[_key - 1] = arguments[_key];
      }

      cache[firstArg] = func.apply(void 0, [firstArg].concat(otherArgs));
    }

    return cache[firstArg];
  };
}