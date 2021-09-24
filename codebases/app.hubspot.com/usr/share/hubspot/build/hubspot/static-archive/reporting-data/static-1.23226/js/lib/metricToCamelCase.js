'use es6';

import _toArray from "@babel/runtime/helpers/esm/toArray";
export var metricToCamelCase = function metricToCamelCase(type) {
  var _type$split = type.split('_'),
      _type$split2 = _toArray(_type$split),
      first = _type$split2[0],
      rest = _type$split2.slice(1);

  return first.toLowerCase() + rest.map(function (word) {
    return word.slice(0, 1) + word.slice(1).toLowerCase();
  }).join('');
};