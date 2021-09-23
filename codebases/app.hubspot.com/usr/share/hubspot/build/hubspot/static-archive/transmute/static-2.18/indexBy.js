"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reduce2 = _interopRequireDefault(require("./internal/_reduce"));

var _curry = _interopRequireDefault(require("./curry"));

var _immutable = require("immutable");

function indexBy(keyMapper, subject) {
  return (0, _reduce2.default)(_immutable.Iterable.isOrdered(subject) || !_immutable.Iterable.isIterable(subject) ? (0, _immutable.OrderedMap)() : (0, _immutable.Map)(), function (acc, v, k) {
    return acc.set(keyMapper(v, k, subject), v);
  }, subject);
}
/**
 * Create a Map, or OrderedMap from `subject` with a key for each item
 * returned by `keyMapper`.
 *
 * @example
 * indexBy(get('id'), List.of({id: 123}, {id: 456}))
 * // returns Map { 123: {id: 123}, 456: {id: 456} }
 *
 * @param  {Function} keyMapper generates keys for each item
 * @param  {Iterable} subject to index
 * @return {KeyedIterable}
 */


var _default = (0, _curry.default)(indexBy);

exports.default = _default;
module.exports = exports.default;