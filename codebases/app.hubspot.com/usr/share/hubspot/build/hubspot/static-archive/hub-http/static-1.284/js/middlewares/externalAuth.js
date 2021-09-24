"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cookieAuthentication = void 0;

var _cookieAuth = require("./cookieAuth");

var domainsConfig = [{
  csrfCookieName: 'csrf.api',
  matcher: /^[a-z0-9-]+\.hubapi(qa)?\.com$/
}, {
  csrfCookieName: 'csrf.app',
  matcher: /^[a-z0-9-]+\.hubspot(qa)?\.com$/
}];
var externalCookieAuthentication = (0, _cookieAuth.cookieAuthentication)(domainsConfig);
exports.cookieAuthentication = externalCookieAuthentication;