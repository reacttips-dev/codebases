"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeUniqueId = makeUniqueId;

function makeUniqueId() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var lastId = 0;
  return function () {
    return prefix + "-" + ++lastId;
  };
}