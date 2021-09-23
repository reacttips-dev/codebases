"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filter2 = _interopRequireDefault(require("./internal/_filter"));

var _curry = _interopRequireDefault(require("./curry"));

var _immutable = require("immutable");

function pick(keys, subject) {
  var keySet = _immutable.Seq.Set(keys);

  return (0, _filter2.default)(function (value, key) {
    return keySet.contains(key);
  }, subject);
}
/**
 * Select specified keys from a KeyedIterable (e.g. a `Map` or `OrderedMap`).
 *
 * @example
 * // returns Map { "one" => 1, "three" => 3 }
 * pick(
 *   ['one', 'three'],
 *   Map({one: 1, two: 2, three: 3})
 * );
 *
 * @param  {Array|Iterable|Object} keys to select.
 * @param  {KeyedIterable} subject from which to select `keys`.
 * @return {KeyedIterable} with just `keys`.
 */


var _default = (0, _curry.default)(pick);

exports.default = _default;
module.exports = exports.default;