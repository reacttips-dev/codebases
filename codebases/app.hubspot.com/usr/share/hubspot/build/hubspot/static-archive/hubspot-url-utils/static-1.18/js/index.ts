"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFullUrl = getFullUrl;

var _internal = require("./internal");

function getFullUrl(subDomainPrefix, overrideConfig) {
  var subDomain = (0, _internal.getSubDomain)(subDomainPrefix, overrideConfig);
  var domain = (0, _internal.getDomain)(overrideConfig);
  var tld = (0, _internal.getTld)(overrideConfig);
  return "https://" + subDomain + "." + domain + "." + tld;
}