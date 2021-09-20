"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

// This code originally has been copied from Recompose
// https://github.com/acdlite/recompose/blob/master/src/packages/recompose/compose.js
exports.default = function () {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  var last = funcs[funcs.length - 1];
  return function () {
    var result = last.apply(undefined, arguments);
    for (var i = funcs.length - 2; i >= 0; i -= 1) {
      var f = funcs[i];
      result = f(result);
    }
    return result;
  };
};