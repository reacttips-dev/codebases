"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _entrySeq2 = _interopRequireDefault(require("./internal/_entrySeq"));

/**
 * Get a Seq of the entries (i.e. [key, value] tuples) in `subject`.
 *
 * @example
 * entrySeq(Map({one: 1, two: 2}))
 * // returns Seq [ ['one', 1], ['two', 2] ]
 *
 * @param  {Array|Iterable|Object} subject
 * @return {Seq}
 */
var _default = _entrySeq2.default;
exports.default = _default;
module.exports = exports.default;