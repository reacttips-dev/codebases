'use es6';

export var curryable = function curryable(func) {
  var curry = function curry() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return args.length >= func.length ? func.apply(null, args) : curry.bind.apply(curry, [null].concat(args));
  };

  return curry;
};