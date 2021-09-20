"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function normalizeUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  return url.trim().toLowerCase();
}

function normalizeOptions(options) {
  var normalized = !options || _typeof(options) !== "object" ? Object.create(null) : options;

  if ("privateTlds" in normalized === false) {
    normalized.privateTlds = false;
  }

  if ("customTlds" in normalized && normalized.customTlds instanceof RegExp === false) {
    normalized.customTlds = new RegExp("\\.(" + normalized.customTlds.join("|") + ")$");
  }

  return normalized;
}

exports.url = normalizeUrl;
exports.options = normalizeOptions;