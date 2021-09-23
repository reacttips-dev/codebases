"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCookie = void 0;

var getCookie = function getCookie(name, cookies) {
  var value = "; " + cookies;
  var splitCookies = value.split(';');

  if (splitCookies.length) {
    for (var i = 0; i < splitCookies.length; i++) {
      var parts = splitCookies[i].split('=');

      if (parts.length === 2 && parts[0].trim() === name) {
        return parts[1];
      }
    }
  }

  return null;
};

exports.getCookie = getCookie;