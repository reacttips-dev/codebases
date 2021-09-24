"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _curry = _interopRequireDefault(require("./curry"));

var _setArity2 = _interopRequireDefault(require("./internal/_setArity"));

/**
 * Creates a function identical to `operation` but with length `arity`.
 *
 * @example
 * const op = (...args) => args;
 * op.length === 0;
 *
 * const twoArgOp = setArity(2, op);
 * twoArgOp.length === 2;
 *
 * @param  {number} arity from 0 to 9
 * @param  {Function} operation
 * @return {Function}
 */
var setArity = (0, _curry.default)(_setArity2.default);
var _default = setArity;
exports.default = _default;
module.exports = exports.default;