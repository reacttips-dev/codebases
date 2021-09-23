'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import PortalIdParser from 'PortalIdParser';
export var getRootUrl = function getRootUrl(baseUrl) {
  return baseUrl + "/" + PortalIdParser.get();
};
export var parseQueryParams = function parseQueryParams(query) {
  var params = {};

  if (query && query.length > 1) {
    query.split('&').forEach(function (param) {
      var _param$split = param.split('='),
          _param$split2 = _slicedToArray(_param$split, 2),
          key = _param$split2[0],
          value = _param$split2[1];

      params[key] = value;
    });
  }

  return params;
};