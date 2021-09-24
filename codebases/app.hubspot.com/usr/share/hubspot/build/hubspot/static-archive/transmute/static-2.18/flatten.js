"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = flatten;

var _flattenN2 = _interopRequireDefault(require("./internal/_flattenN"));

/**
 * Flattens an iterable as deeply as possible.
 *
 * @example
 * // return List [ 1, 2, 3, 4, 5, 6 ]
 * flatten(List.of(List.of(1, List.of(2, 3)), List.of(4, 5, 6)));
 *
 * @param {Iterable} subject
 * @return {Iterable}
 */
function flatten(subject) {
  return (0, _flattenN2.default)(Infinity, subject);
}

module.exports = exports.default;