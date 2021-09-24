'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import getQueryString from './getQueryString';
var cachedQueryString;
var LEADIN_CONFIG = 'LEADIN_CONFIG';
var leadinConfigKeys = {
  l: 'language',
  php: 'phpVersion',
  wp: 'wpVersion',
  v: 'leadinPluginVersion',
  theme: 'theme',
  admin: 'admin'
};
export default function getLeadinConfig() {
  try {
    if (typeof cachedQueryString !== 'undefined') {
      return cachedQueryString;
    }

    var queryParams = {};

    try {
      queryParams = JSON.parse(sessionStorage.getItem(LEADIN_CONFIG)) || {};
    } catch (e) {//
    }

    var search = getQueryString();
    var pairs = search.slice(1).split('&');
    pairs.forEach(function (pair) {
      var _pair$split = pair.split('='),
          _pair$split2 = _slicedToArray(_pair$split, 2),
          key = _pair$split2[0],
          value = _pair$split2[1];

      if (leadinConfigKeys.hasOwnProperty(key)) {
        queryParams[leadinConfigKeys[key]] = decodeURIComponent(value || '');
      }
    });
    cachedQueryString = queryParams;

    try {
      sessionStorage.setItem(LEADIN_CONFIG, JSON.stringify(queryParams));
    } catch (e) {//
    }

    return queryParams;
  } catch (e) {
    return {};
  }
}
export function clearCachedQueryStringForTests() {
  cachedQueryString = undefined;
}