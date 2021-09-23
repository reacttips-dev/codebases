"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _TransmuteCollection = require("./TransmuteCollection");

var jsToEntrySeq = function jsToEntrySeq(subject) {
  return (0, _immutable.Seq)(subject).entrySeq();
};

_TransmuteCollection.entrySeq.implement(Array, jsToEntrySeq);

_TransmuteCollection.entrySeq.implementInherited(_immutable.Iterable, function (subject) {
  return subject.entrySeq();
});

_TransmuteCollection.entrySeq.implement(Object, jsToEntrySeq);

var _default = _TransmuteCollection.entrySeq;
exports.default = _default;
module.exports = exports.default;