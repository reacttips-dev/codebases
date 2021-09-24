"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setHeader = exports.getHeader = void 0;

var _update = require("./update");

var getHeader = function getHeader(name, responseOrOptions) {
  var headers = responseOrOptions.headers;

  if (!headers) {
    return undefined;
  }

  for (var header in headers) {
    if (headers.hasOwnProperty(header) && header.toLowerCase() === name.toLowerCase()) {
      return headers[header];
    }
  }

  return undefined;
};

exports.getHeader = getHeader;

var setHeader = function setHeader(name, value, options) {
  var headers = options.headers;

  for (var header in headers) {
    if (headers.hasOwnProperty(header) && header.toLowerCase() === name.toLowerCase()) {
      return (0, _update.setIn)(['headers', header], value)(options);
    }
  }

  return (0, _update.setIn)(['headers', name], value)(options);
};

exports.setHeader = setHeader;