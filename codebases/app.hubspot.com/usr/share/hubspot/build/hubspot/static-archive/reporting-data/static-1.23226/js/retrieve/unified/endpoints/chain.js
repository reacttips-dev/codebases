'use es6';

export var chain = function chain() {
  for (var _len = arguments.length, processors = new Array(_len), _key = 0; _key < _len; _key++) {
    processors[_key] = arguments[_key];
  }

  return function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    return function (response) {
      return processors.reduce(function (processed, processor) {
        return processor.apply(void 0, args)(processed);
      }, response);
    };
  };
};