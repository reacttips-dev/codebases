"use strict";
'use es6';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = exports.stringify = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

function serializeValue(key, value) {
  return encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? '' : value);
}

function serializeArray(key, value) {
  return value.reduce(function (result, current) {
    // mimic the default jQuery behavior here
    if (current != null) {
      result.push(serializeValue("" + key, current));
    }

    return result;
  }, []).join('&');
}

var stringify = function stringify(query) {
  if (query == null) return '';
  if (typeof query === 'string' || query instanceof String) return query;
  return Object.keys(query).reduce(function (result, key) {
    var value = query[key];

    if (Array.isArray(value)) {
      if (value.length > 0) result.push(serializeArray(key, value));
    } else if (value != null) {
      result.push(serializeValue(key, value));
    }

    return result;
  }, []).join('&');
};

exports.stringify = stringify;

var parse = function parse(query) {
  if (query == null || query.trim() === '') {
    return {};
  }

  return query.split('&').reduce(function (result, current) {
    var _current$split = current.split('='),
        _current$split2 = (0, _slicedToArray2.default)(_current$split, 2),
        key = _current$split2[0],
        value = _current$split2[1];

    var keyName = key;
    var decodedValue = decodeURIComponent(value); // parse query strings in the form foo[] for arrays. This is only for compatibility and
    // repeating keys should be favored.

    if (keyName.length > 2 && keyName.lastIndexOf('[]') === keyName.length - 2) {
      keyName = keyName.substring(0, keyName.length - 2);
    }

    var existing = result[keyName];

    if (existing !== undefined) {
      if (Array.isArray(existing)) {
        existing.push(decodedValue);
      } else {
        result[keyName] = [existing, decodedValue];
      }
    } else {
      result[keyName] = decodedValue;
    }

    return result;
  }, {});
};

exports.parse = parse;