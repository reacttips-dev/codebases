"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _clear2 = _interopRequireDefault(require("./internal/_clear"));

/**
 * Returns an empty copy of `subject`.
 *
 * @example
 * clear([1, 2, 3]) // returns []
 * clear(List.of(1, 2, 3)) // returns List []
 * clear({one: 1, two: 2, three: 3}) // returns {}
 *
 * @param {Array|Collection|Object} subject
 * @return {Array|Collection|Object}
 */
var _default = _clear2.default;
exports.default = _default;
module.exports = exports.default;