import objectIs from './objectIs';

/**
 * Returns a wrapper function that, when called, either:
 *
 * 1. Returns a cached result if given the same args as the last time it was called, or
 * 2. If any args are different from last time, calls through to `func`
 *
 * @param {Function} func
 * @param {?Function} equalityFn A function of the form `(a, b) => <bool>`
 * @returns {Function}
 */
export default function memoize(func) {
  var equalityFn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : objectIs;
  var hasBeenCalled = false;
  var lastArgs;
  var lastResult;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (!hasBeenCalled || args.some(function (arg, i) {
      return !equalityFn(arg, lastArgs[i]);
    })) {
      hasBeenCalled = true;
      lastArgs = args;
      lastResult = func.apply(void 0, args);
    }

    return lastResult;
  };
}