"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _get2 = _interopRequireDefault(require("./internal/_get"));

var _map2 = _interopRequireDefault(require("./internal/_map"));

var _curry = _interopRequireDefault(require("./curry"));

function pluck(key, subject) {
  return (0, _map2.default)(function (item) {
    return (0, _get2.default)(key, item);
  }, subject);
}
/**
 * Select `key` from each item in `subject`.
 *
 * @example
 * const pluckName = pluck('name');
 * pluckName(userMap) === Map({123: 'Testing'});
 *
 * @param  {any} key
 * @param  {Iterable} subject
 * @return {Iterable}
 */


var _default = (0, _curry.default)(pluck);

exports.default = _default;
module.exports = exports.default;