"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(target) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  sources.forEach(function (source) {
    for (var name in source) {
      if (Object.prototype.hasOwnProperty.call(source, name)) {
        target[name] = source[name];
      }
    }
  });
  return target;
}