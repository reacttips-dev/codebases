"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filter2 = _interopRequireDefault(require("./internal/_filter"));

var _curry = _interopRequireDefault(require("./curry"));

var _immutable = require("immutable");

function without(unwanted, subject) {
  unwanted = _immutable.Seq.Set(unwanted);
  return (0, _filter2.default)(function (value) {
    return !unwanted.includes(value);
  }, subject);
}
/**
 * Removes values in `unwanted` from `subject`.
 *
 * @example
 * const removeOne = without(Set.of(1));
 *
 * removeOne(Set.of(1, 2, 3)) // returns Set { 2, 3 }
 *
 *
 * @param  {Iterable} unwanted
 * @param  {Iterable} subject
 * @return {Iterable}
 */


var _default = (0, _curry.default)(without);

exports.default = _default;
module.exports = exports.default;