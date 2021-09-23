"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _immutable = require("immutable");

var _TransmuteCollection = require("./TransmuteCollection");

_TransmuteCollection.forEach.implement(Array, function (effect, arr) {
  return arr.forEach(effect);
});

_TransmuteCollection.forEach.implementInherited(_immutable.Iterable, function (effect, subject) {
  return subject.forEach(effect);
});

_TransmuteCollection.forEach.implement(Object, function (effect, obj) {
  var keys = Object.keys(obj);
  var len = keys.length;

  for (var i = 0; i < len; i++) {
    var key = keys[i];
    effect(obj[key], key, obj);
  }

  return obj;
});

var _default = _TransmuteCollection.forEach;
exports.default = _default;
module.exports = exports.default;