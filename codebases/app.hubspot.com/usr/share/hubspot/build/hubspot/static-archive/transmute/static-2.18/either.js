"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _curry = _interopRequireDefault(require("./curry"));

function either(first, second, arg) {
  return Boolean(first(arg) || second(arg));
}
/**
 * Returns true if the results of `arg` applied to either `first` or `second`
 * are truthy.
 *
 * @example
 * const oneOrTwo = either(
 *   n => n === 1,
 *   n => n === 2
 * );
 *
 * oneOrTwo(1) === true;
 * oneOrTwo(2) === true;
 * oneOrTwo(3) === false;
 *
 * @param  {Function} first
 * @param  {Function} second
 * @param  {any} subject
 * @return {boolean}
 */


var _default = (0, _curry.default)(either);

exports.default = _default;
module.exports = exports.default;