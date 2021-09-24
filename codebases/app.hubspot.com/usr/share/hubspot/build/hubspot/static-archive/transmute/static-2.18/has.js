"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _curry = _interopRequireDefault(require("./curry"));

var _has2 = _interopRequireDefault(require("./internal/_has"));

/**
 * Returns `true` if `key` exists in `subject`.
 *
 * @example
 * const hasOne = has('one');
 *
 * hasOne({one: 1}) === true;
 * hasOne(Map({two: 2})) === false;
 *
 * @param {any} key
 * @param {Array|Iterable|Object} subject
 * @return {boolean}
 */
var _default = (0, _curry.default)(_has2.default);

exports.default = _default;
module.exports = exports.default;