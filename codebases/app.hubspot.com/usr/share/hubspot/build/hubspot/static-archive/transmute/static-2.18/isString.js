"use strict";
'use es6';
/**
 * Returns true if `value` is a String.
 * 
 * @param {any} value
 * @return {boolean}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isString;

function isString(value) {
  return typeof value === 'string';
}

module.exports = exports.default;