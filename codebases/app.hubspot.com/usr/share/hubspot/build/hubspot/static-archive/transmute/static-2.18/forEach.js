"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _curry = _interopRequireDefault(require("./curry"));

var _forEach2 = _interopRequireDefault(require("./internal/_forEach"));

/**
 * Executes `effect` for each value in `subject`, then returns `subject`.
 *
 * @example
 * forEach(
 *   v => console.log(v),
 *   Map({ one: 1, two: 2, three: 3 })
 * );
 *
 * // prints...
 * // 1
 * // 2
 * // 3
 *
 * @param {Function} effect
 * @param {TYPE} subject
 * @return {TYPE}
 */
var _default = (0, _curry.default)(_forEach2.default);

exports.default = _default;
module.exports = exports.default;