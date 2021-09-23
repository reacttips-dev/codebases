"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responseError = exports.handleResponse = exports.responseHandlers = void 0;

var _update = require("./update");

var responseHandlersKey = Symbol('responseHandlers');

var responseHandlers = function responseHandlers(options) {
  return options[responseHandlersKey];
};

exports.responseHandlers = responseHandlers;

var handleResponse = function handleResponse(handler) {
  return (0, _update.push)(responseHandlersKey, handler);
};

exports.handleResponse = handleResponse;

var responseError = function responseError(response, message, code, previousError) {
  return Object.assign(new Error(), response, {
    message: message,
    code: code,
    previousError: previousError
  });
};

exports.responseError = responseError;