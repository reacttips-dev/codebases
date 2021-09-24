'use es6';

export default function memoize(func) {
  var hasher = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (args) {
    return JSON.stringify(args);
  };

  var memoized = function memoized() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var breakMemoization = !!args.length && !!args[0] && args.find(function (arg) {
      return arg.shouldMemoize && arg.shouldMemoize === false;
    });

    if (breakMemoization) {
      return func.apply(this, args);
    }

    var cache = memoized.cache;
    var address = "" + hasher.apply(this, args);
    if (!cache[address]) cache[address] = func.apply(this, args);
    return cache[address];
  };

  memoized.cache = {};
  return memoized;
}