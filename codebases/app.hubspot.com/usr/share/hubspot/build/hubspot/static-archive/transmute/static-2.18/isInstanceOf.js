"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _curry = _interopRequireDefault(require("./curry"));

function isInstanceOf(Constructor, value) {
  return value instanceof Constructor;
}
/**
 * Returns true if `value` is an instance of `Constructor`.
 *
 * @param  {Function} Constructor
 * @param  {any} value
 * @return {boolean}
 */


var _default = (0, _curry.default)(isInstanceOf);

exports.default = _default;
module.exports = exports.default;