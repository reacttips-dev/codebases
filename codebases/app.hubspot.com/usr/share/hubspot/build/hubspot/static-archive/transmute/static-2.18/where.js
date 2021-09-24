"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filter2 = _interopRequireDefault(require("./internal/_filter"));

var _curry = _interopRequireDefault(require("./curry"));

var _match = _interopRequireDefault(require("./match"));

function where(pattern, subject) {
  return (0, _filter2.default)((0, _match.default)(pattern), subject);
}
/**
 * Takes items in `subject` that match `pattern`.
 *
 * @example
 * const users = Map({
 *   123: {id: '123', name: 'Jack'},
 *   456: {id: '456', name: 'Jill'},
 * });
 *
 * where({name: 'Jack'}, users);
 * // returns Map { 123: {id: '123', name: 'Jack'} }
 *
 * @param  {Function} pattern
 * @param  {Iterable} subject
 * @return {Iterable}
 */


var _default = (0, _curry.default)(where);

exports.default = _default;
module.exports = exports.default;