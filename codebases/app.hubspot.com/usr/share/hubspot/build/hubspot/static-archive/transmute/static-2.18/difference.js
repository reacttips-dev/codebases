"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filter2 = _interopRequireDefault(require("./internal/_filter"));

var _curry = _interopRequireDefault(require("./curry"));

function difference(toRemove, subject) {
  if (!toRemove) {
    return subject;
  }

  return (0, _filter2.default)(function (value) {
    return !toRemove.contains(value);
  }, subject);
}
/**
 * Take the difference between one iterable and another iterable.
 * Only the elements present in just subject will remain.
 *
 * @example
 * const removeOne = difference(Set.of(1));
 *
 * removeOne(Set.of(1, 2, 3)) // returns Set { 2, 3 }
 *
 * @param  {Iterable} toRemove
 * @param  {Iterable} subject
 * @return {Iterable}
 */


var _default = (0, _curry.default)(difference);

exports.default = _default;
module.exports = exports.default;