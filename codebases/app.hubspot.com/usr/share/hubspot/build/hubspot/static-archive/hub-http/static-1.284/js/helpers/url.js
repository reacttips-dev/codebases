"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildUrl = exports.parseUrl = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var regex = /^(?:(?:([^:/?#]+):)?(?:\/\/([^:/?#]+)(?::([0-9]+))?)+?)?([^?#]+)?(?:\?([^#]*))?(?:#(.+))?/;

var getDefaultPort = function getDefaultPort(protocol) {
  var normalizedProtocol = (protocol || '').toLowerCase();
  if (!normalizedProtocol) return null;
  if (normalizedProtocol === 'http') return 80;
  if (normalizedProtocol === 'https') return 443;
  return null;
};

var parseUrl = function parseUrl(url) {
  var _regex$exec = regex.exec(url),
      _regex$exec2 = (0, _slicedToArray2.default)(_regex$exec, 7),
      protocol = _regex$exec2[1],
      hostname = _regex$exec2[2],
      port = _regex$exec2[3],
      path = _regex$exec2[4],
      query = _regex$exec2[5],
      hash = _regex$exec2[6];

  return {
    protocol: protocol,
    hostname: hostname,
    port: port !== undefined ? parseInt(port, 10) : getDefaultPort(protocol),
    path: path,
    query: query,
    hash: hash
  };
};

exports.parseUrl = parseUrl;

var isDefaultPort = function isDefaultPort(descriptor) {
  if (!descriptor.port) return true;
  if (!descriptor.protocol) return true;
  var protocol = (descriptor.protocol || '').toLowerCase();
  if (protocol === 'http' && descriptor.port === 80) return true;
  if (protocol === 'https' && descriptor.port === 443) return true;
  return false;
};

var buildUrl = function buildUrl(descriptor) {
  return [descriptor.hostname ? (descriptor.protocol || 'https') + "://" : '', descriptor.hostname, isDefaultPort(descriptor) ? '' : ":" + descriptor.port, descriptor.hostname && descriptor.path && descriptor.path.substr(0, 1) !== '/' ? "/" + descriptor.path : descriptor.path, descriptor.query ? "?" + descriptor.query : '', descriptor.hash ? "#" + descriptor.hash : ''].join('');
};

exports.buildUrl = buildUrl;