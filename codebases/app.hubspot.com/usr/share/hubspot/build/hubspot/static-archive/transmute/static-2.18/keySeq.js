"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _keySeq2 = _interopRequireDefault(require("./internal/_keySeq"));

/**
 * Get a Seq of the keys in `subject`.
 *
 * @example
 * keySeq({one: 1, two: 2, three: 3})
 * // returns Seq [ 'one', 'two', 'three' ]
 *
 * @param  {Iterable|Object|Array} subject
 * @return {Seq}
 */
var _default = _keySeq2.default;
exports.default = _default;
module.exports = exports.default;