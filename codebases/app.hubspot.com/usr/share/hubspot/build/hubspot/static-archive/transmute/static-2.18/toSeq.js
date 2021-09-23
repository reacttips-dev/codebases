"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toSeq;

var _immutable = require("immutable");

/**
 * Converts `subject` to a `Seq` if possible.
 *
 * @param  {Array|Iterable|Object|String} subject
 * @return {Seq}
 */
function toSeq(subject) {
  return (0, _immutable.Seq)(subject);
}

module.exports = exports.default;