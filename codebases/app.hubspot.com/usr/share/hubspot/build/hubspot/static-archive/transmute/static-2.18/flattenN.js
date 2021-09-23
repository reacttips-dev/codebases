"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _curry = _interopRequireDefault(require("./curry"));

var _flattenN2 = _interopRequireDefault(require("./internal/_flattenN"));

/**
 * Flattens an iterable `depth` levels.
 *
 * @example
 * // return List [ 1, List [ 2, 3 ], 4, 5, 6 ]
 * flattenN(1, List.of(List.of(1, List.of(2, 3)), List.of(4, 5, 6)));
 *
 * @param {number} depth
 * @param {Iterable} subject
 * @return {Iterable}
 */
var _default = (0, _curry.default)(_flattenN2.default);

exports.default = _default;
module.exports = exports.default;