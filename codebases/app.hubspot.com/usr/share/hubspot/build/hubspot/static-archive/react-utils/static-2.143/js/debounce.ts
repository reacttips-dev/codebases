// pared down from
// https://github.com/facebook/fbjs/blob/master/packages/fbjs/src/core/debounceCore.js
export default (function (fn, wait, context) {
  var timeout;

  function debouncer() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    debouncer.reset();

    var callback = function callback() {
      fn.apply(context, args);
    };

    timeout = setTimeout(callback, wait);
  }

  debouncer.reset = function () {
    clearTimeout(timeout);
  };

  return debouncer;
});