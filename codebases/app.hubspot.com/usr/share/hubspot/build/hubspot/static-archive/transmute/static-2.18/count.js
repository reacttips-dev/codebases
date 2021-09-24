"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _count2 = _interopRequireDefault(require("./internal/_count"));

/**
 * Returns the number of values in `subject`.
 *
 * @example
 * count(List.of(1, 2, 3)) === 3;
 *
 * @param {TYPE} subject
 * @return {number}
 */
var _default = _count2.default;
exports.default = _default;
module.exports = exports.default;