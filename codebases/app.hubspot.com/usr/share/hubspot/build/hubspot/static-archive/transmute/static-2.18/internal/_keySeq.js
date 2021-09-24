"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _TransmuteCollection = require("./TransmuteCollection");

var jsToKeySeq = function jsToKeySeq(subject) {
  return (0, _immutable.Seq)(subject).keySeq();
};

_TransmuteCollection.keySeq.implement(Array, jsToKeySeq);

_TransmuteCollection.keySeq.implementInherited(_immutable.Iterable, function (subject) {
  return subject.keySeq();
});

_TransmuteCollection.keySeq.implement(Object, jsToKeySeq);

var _default = _TransmuteCollection.keySeq;
exports.default = _default;
module.exports = exports.default;