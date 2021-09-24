'use es6';

export function addQueryParam(url, key, val) {
  var separator = url.indexOf('?') === -1 ? '?' : '&';
  return "" + url + separator + key + "=" + val;
}