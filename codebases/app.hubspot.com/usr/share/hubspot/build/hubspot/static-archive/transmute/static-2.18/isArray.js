"use strict";
'use es6';
/**
 * Returns `true` if value is an Array.
 * 
 * @param {any} value
 * @return {boolean}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isArray;

function isArray(value) {
  return Array.isArray(value);
}

module.exports = exports.default;