"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _every2 = _interopRequireDefault(require("./internal/_every"));

var _get2 = _interopRequireDefault(require("./internal/_get"));

var _has2 = _interopRequireDefault(require("./internal/_has"));

var _curry = _interopRequireDefault(require("./curry"));

var _immutable = require("immutable");

function match(pattern, candidate) {
  return (0, _every2.default)(function (val, key) {
    return (0, _has2.default)(key, candidate) && (0, _immutable.is)(val, (0, _get2.default)(key, candidate));
  }, pattern);
}
/**
 * Returns `true` if the key => value pairs in `pattern` match the correspoding key => value pairs in `subject`.
 *
 * @example
 * const hasOneAndThree = match({one: 1, three: 3});
 * hasOneAndThree(Map({one: 1, two: 2, three: 3})) === true;
 *
 * @param {Array|Iterable|Object} pattern
 * @param {Array|Iterable|Object} subject
 * @return {boolean}
 */


var _default = (0, _curry.default)(match);

exports.default = _default;
module.exports = exports.default;