'use es6';

export default (function () {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }

  return function (arg) {
    var result = arg;

    for (var i = functions.length - 1; i >= 0; i--) {
      result = functions[i](result);
    }

    return result;
  };
});