'use es6'; // Shallow copy all values from sources to target
// @See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

export function objectAssign(target) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  sources.forEach(function (source) {
    var descriptors = Object.keys(source).reduce(function (descriptors, key) {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});
    Object.defineProperties(target, descriptors);
  });
  return target;
}
; // Create a new object with all values from sources
// This method reads from left to right, so that defaults({ a: 1 }, { b: 2 }, { a: 3, b: 4, c: 5 })
// produces { a: 1, b: 2, c: 5 }

export function defaults() {
  var _arguments = arguments;

  if (arguments.length === 0) {
    return undefined;
  }

  var clone = objectAssign({}, arguments.length <= 0 ? undefined : arguments[0]);

  if (arguments.length === 1) {
    return clone;
  }

  var _loop = function _loop(i) {
    var source = i < 0 || _arguments.length <= i ? undefined : _arguments[i];
    var descriptors = Object.keys(source).reduce(function (descriptors, key) {
      if (typeof clone[key] === 'undefined') {
        descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      }

      return descriptors;
    }, {});
    Object.defineProperties(clone, descriptors);
  };

  for (var i = 1; i < arguments.length; i++) {
    _loop(i);
  }

  return clone;
}
;