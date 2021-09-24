"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _count2 = _interopRequireDefault(require("./internal/_count"));

var _has2 = _interopRequireDefault(require("./internal/_has"));

var _curry = _interopRequireDefault(require("./curry"));

var _getIn = _interopRequireDefault(require("./getIn"));

var getInOp = _getIn.default.operation;

function hasIn(keyPath, subject) {
  var keyLen = (0, _count2.default)(keyPath);

  if (keyLen === 0) {
    return false;
  }

  var parent = getInOp(keyPath.slice(0, -1), subject);

  if (parent === undefined) {
    return false;
  }

  return (0, _has2.default)(keyPath[keyLen - 1], parent);
}
/**
 * Returns `true` if `keyPath` is defined in a nested data structure.
 *
 * `hasIn` short circuts and returns `false` when it encounters a `null` or `undefined` value.
 *
 * @example
 * const hasFirstName = hasIn(['name', 'first']);
 * const user = UserRecord({
 *   name: Map({
 *     first: 'Test',
 *     last: 'Testerson',
 *   }),
 * });
 * hasFirstName(user) === true
 *
 * @param  {Array<string>} keyPath
 * @param  {Array|Iterable|Object} subject
 * @return {boolean}
 */


var _default = (0, _curry.default)(hasIn);

exports.default = _default;
module.exports = exports.default;