'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.clone = clone;
exports.defaults = defaults;
exports.forEach = forEach;
function clone(_ref) {
  var title = _ref.title,
      description = _ref.description,
      base = _ref.base,
      canonical = _ref.canonical,
      meta = _ref.meta,
      link = _ref.link,
      auto = _ref.auto;

  try {
    return JSON.parse(JSON.stringify({ title: title, description: description, base: base, canonical: canonical, meta: meta, link: link, auto: auto }));
  } catch (x) {
    return {};
  }
}

function defaults(target, source) {
  return Object.keys(source).reduce(function (acc, key) {
    if (!target.hasOwnProperty(key)) {
      target[key] = source[key];
    } else if (_typeof(target[key]) === 'object' && !Array.isArray(target[key]) && target[key]) {
      defaults(target[key], source[key]);
    }

    return target;
  }, target);
}

function forEach(arr, fn) {
  Array.prototype.slice.call(arr || []).forEach(fn);
}
