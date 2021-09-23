"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _clear = _interopRequireDefault(require("./clear"));

var _curry = _interopRequireDefault(require("./curry"));

var _immutable = require("immutable");

var _reduce2 = _interopRequireDefault(require("./internal/_reduce"));

var _set2 = _interopRequireDefault(require("./internal/_set"));

function mapKeys(keyMapper, subject) {
  var isIterable = _immutable.Iterable.isIterable(subject);

  if (isIterable && !_immutable.Iterable.isKeyed(subject) || !isIterable && subject.constructor !== Object) {
    throw new Error("expected an Object or other Keyed Collection but got `" + subject + "`");
  }

  return (0, _reduce2.default)((0, _clear.default)(subject), function (acc, value, key) {
    return (0, _set2.default)(keyMapper(key, value, subject), value, acc);
  }, subject);
}
/**
 * Like `map` but transforms an Iterable's keys rather than its values.
 *
 * @example <caption>Can be useful for converting keys of API results to a common type.</caption>
 * import { mapKeys, toString } from 'transmute';
 * const stringifyKeys = mapKeys(toString);
 * const m = Map.of(123, Map(), 456, Map(), 789, Map());
 * stringifyKeys(m).equals(Map.of('123', Map(), '456', Map(), '789', Map()));
 *
 * @param  {Function} keyMapper returns a new key
 * @param  {KeyedIterable} subject
 * @return {KeyedIterable}
 */


var _default = (0, _curry.default)(mapKeys);

exports.default = _default;
module.exports = exports.default;