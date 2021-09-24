'use es6';

export var debounce = function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;

    for (var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++) {
      arg[_key] = arguments[_key];
    }

    var args = arg;

    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
export var once = function once(func) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var result;

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function in avatars once');
  }

  return function () {
    if (--n > 0) {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      result = func.apply(this, args);
    }

    if (n <= 1) {
      func = undefined;
    }

    return result;
  };
};