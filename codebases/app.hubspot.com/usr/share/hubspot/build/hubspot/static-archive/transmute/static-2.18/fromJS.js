"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fromJS;

var _immutable = require("immutable");

/**
 * A version of Immutable.fromJS that drops all but the first argument for
 * compatibility with other transmute functions like `map`.
 *
 * @example
 * fromJS({items: [1, 2, 3]})
 * // returns Map { items: List [ 1, 2, 3 ] }
 *
 * @param {any} json
 * @return {?Iterable}
 */
function fromJS(json) {
  return (0, _immutable.fromJS)(json);
}

module.exports = exports.default;