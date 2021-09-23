"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _valueSeq2 = _interopRequireDefault(require("./internal/_valueSeq"));

/**
 * Get a Seq of the values in `subject`.
 *
 * @example
 * valueSeq(Map({ one: 1, two: 2, three: 3 }))
 * // returns Seq [ 1, 2, 3 ]
 *
 * @param  {Iterable|Object|Array} subject
 * @return {Seq}
 */
var _default = _valueSeq2.default;
exports.default = _default;
module.exports = exports.default;