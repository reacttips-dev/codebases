"use strict";
'use es6';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var CACHE_KEY_PREFIX = 'hapijs_options'; // reuse data from hapijs

var cacheKey = function cacheKey(options) {
  return CACHE_KEY_PREFIX + ":" + options.portalId;
};

var cache = {
  get: function get(options) {
    var item = options.localStorage && options.localStorage.getItem(cacheKey(options));
    return item ? JSON.parse(item) : {};
  },
  set: function set(options, value) {
    if (!options.localStorage) return;
    options.localStorage.setItem(cacheKey(options), JSON.stringify(value));
  },
  clear: function clear(options) {
    if (!options.localStorage) return;
    options.localStorage.removeItem(cacheKey(options));
  }
};
var _default = cache;
exports.default = _default;
module.exports = exports.default;