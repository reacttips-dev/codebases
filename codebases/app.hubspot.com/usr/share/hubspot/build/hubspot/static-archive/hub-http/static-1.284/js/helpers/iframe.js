"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.maybeGetParentIframe = maybeGetParentIframe;
exports.UNAUTHORIZED_MESSAGE = void 0;
var UNAUTHORIZED_MESSAGE = 'unauthorized';
exports.UNAUTHORIZED_MESSAGE = UNAUTHORIZED_MESSAGE;

function maybeGetParentIframe() {
  try {
    if (window.self !== window.top) {
      return window.top;
    }
  } catch (e) {
    return null;
  }

  return null;
}