"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _TransmuteCollection = require("./TransmuteCollection");

_TransmuteCollection.flattenN.implementInherited(_immutable.Iterable, function (depth, subject) {
  return subject.flatten(depth);
});

var _default = _TransmuteCollection.flattenN;
exports.default = _default;
module.exports = exports.default;