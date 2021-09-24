"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _TransmuteCollection = require("./TransmuteCollection");

var jsToValueSeq = function jsToValueSeq(subject) {
  return (0, _immutable.Seq)(subject).valueSeq();
};

_TransmuteCollection.valueSeq.implement(Array, jsToValueSeq);

_TransmuteCollection.valueSeq.implementInherited(_immutable.Iterable, function (subject) {
  return subject.valueSeq();
});

_TransmuteCollection.valueSeq.implement(Object, jsToValueSeq);

var _default = _TransmuteCollection.valueSeq;
exports.default = _default;
module.exports = exports.default;