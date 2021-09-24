"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filter2 = _interopRequireDefault(require("./internal/_filter"));

var _curry = _interopRequireDefault(require("./curry"));

function filterNot(predicate, subject) {
  return (0, _filter2.default)(function () {
    return !predicate.apply(void 0, arguments);
  }, subject);
}
/**
 * Remove values for which `predicate` returns `true`.
 *
 * @example
 * // returns List [ 1, 3 ]
 * filterNot(
 *   (n) => n % 2 === 0,
 *   List.of(1, 2, 3)
 * );
 *
 * @param {Function} predicate returns `true` if a value should be excluded.
 * @param {Iterable} subject to filter.
 * @return {Iterable} without values that matched `predicate`.
 */


var _default = (0, _curry.default)(filterNot);

exports.default = _default;
module.exports = exports.default;