import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
export var HUBSPOT_API_CSRF = 'csrf.api';
export var HUBSPOT_APP_CSRF = 'csrf.app';
export function getCookies() {
  return document.cookie.split(';').map(function (cookie) {
    return cookie.trim();
  }).reduce(function (cookieMap, keyValuePair) {
    var _keyValuePair$split = keyValuePair.split('='),
        _keyValuePair$split2 = _slicedToArray(_keyValuePair$split, 2),
        key = _keyValuePair$split2[0],
        value = _keyValuePair$split2[1];

    return Object.assign(_defineProperty({}, key, value), cookieMap);
  }, {});
}
export function getCookie(key) {
  return getCookies()[key] || '';
}
export function getCsrfCookie(domain) {
  if (domain === 'hubspot') {
    return getCookie(HUBSPOT_APP_CSRF);
  }

  return getCookie(HUBSPOT_API_CSRF);
}
export function setCookie(key, value) {
  var expiresInMillis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60 * 24 * 60 * 60 * 1000;
  var currentTime = new Date();
  currentTime.setTime(currentTime.getTime() + expiresInMillis);
  var expiryTime = currentTime.toUTCString();
  document.cookie = key + "=" + value + ";expires=" + expiryTime + ";path=/";
}