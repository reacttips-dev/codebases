"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stableStringify = stableStringify;

function stableStringify(obj) {
  var result = [];

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result.push(key);
      result.push(String(obj[key]));
    }
  }

  return result.sort().toString();
}