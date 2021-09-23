"use strict";
'use es6';
/**
 * Returns true if `value` is an Object.
 * 
 * @param {any} value
 * @return {boolean}
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isObject;

function isObject(value) {
  return typeof value === 'object' && value !== null;
}

module.exports = exports.default;