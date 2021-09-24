"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isRecord;

var _immutable = require("immutable");

/**
 * Returns `true` if `subject` is an instance of a Record.
 * 
 * @param {any} subject
 * @return {boolean}
 */
function isRecord(subject) {
  return _immutable.Iterable.isKeyed(subject) && !_immutable.Map.isMap(subject) && !_immutable.Seq.isSeq(subject);
}

module.exports = exports.default;