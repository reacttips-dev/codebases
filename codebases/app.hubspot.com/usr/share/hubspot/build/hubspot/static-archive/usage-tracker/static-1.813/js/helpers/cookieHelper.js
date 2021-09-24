'use es6';

import { getCookie } from 'hub-http/helpers/cookies';
export var get = function get(key) {
  return getCookie(key, document.cookie);
};
export var set = function set(key, value) {
  var expiresInMillis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60 * 24 * 60 * 60 * 1000;
  var currentTime = new Date();
  var expiryTime = new Date(currentTime.setTime(currentTime.getTime() + expiresInMillis)).toUTCString();
  document.cookie = key + "=" + value + ";expires=" + expiryTime + ";path=/";
};