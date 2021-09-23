'use es6';

export var pipe = function pipe() {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }

  return function (data) {
    return functions.reduce(function (acc, func) {
      return func(acc);
    }, data);
  };
};