"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = clamp;

function clamp(value) {
  var min = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var max = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;
  return Math.min(Math.max(value, min), max);
}