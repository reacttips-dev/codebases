"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSafeMode = void 0;

var isTrue = function isTrue(v) {
  return v && v.toLowerCase() === 'true';
};

var isSafeMode = function isSafeMode(options) {
  return options.safeMode || options.localStorage && isTrue(options.localStorage.getItem('HUB-HTTP_SAFE_MODE'));
};

exports.isSafeMode = isSafeMode;