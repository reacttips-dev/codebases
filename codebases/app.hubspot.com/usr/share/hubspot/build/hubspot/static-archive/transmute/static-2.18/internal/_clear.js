"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _TransmuteCollection = require("./TransmuteCollection");

_TransmuteCollection.clear.implement(Array, function () {
  return [];
});

_TransmuteCollection.clear.implementInherited(_immutable.Collection, function (subject) {
  return subject.clear();
});

_TransmuteCollection.clear.implementInherited(_immutable.Seq, function (seq) {
  if (_immutable.Iterable.isKeyed(seq)) {
    return _immutable.Seq.Keyed();
  }

  if (_immutable.Iterable.isIndexed(seq)) {
    return _immutable.Seq.Indexed();
  }

  return _immutable.Seq.Set();
});

_TransmuteCollection.clear.implement(Object, function () {
  return {};
});

var _default = _TransmuteCollection.clear;
exports.default = _default;
module.exports = exports.default;