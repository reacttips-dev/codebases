'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
export var getOrigin = function getOrigin(url) {
  if (!url || url === '') return '.*';
  var pathArray = url.split('/');
  var protocol = pathArray[0];
  var host = pathArray[2];
  return protocol + "//" + host;
};

var param = function param(key, val) {
  return encodeURIComponent(key) + "=" + encodeURIComponent(val);
};

export var toQueryParams = function toQueryParams(obj) {
  return Object.keys(obj).reduce(function (acc, key) {
    var val = obj[key];
    return [].concat(_toConsumableArray(acc), _toConsumableArray(Array.isArray(val) ? val.map(function (subVal) {
      return param(key, subVal);
    }) : [param(key, val)]));
  }, []).join('&');
};