'use es6'; // from hub-http/helpers/params to avoid dep

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
export var parse = function parse(query) {
  if (query == null || query.trim() === '') {
    return {};
  }

  if (query.indexOf('?') === 0) {
    query = query.substring(1);
  }

  return query.split('&').reduce(function (result, current) {
    var _current$split = current.split('='),
        _current$split2 = _slicedToArray(_current$split, 2),
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