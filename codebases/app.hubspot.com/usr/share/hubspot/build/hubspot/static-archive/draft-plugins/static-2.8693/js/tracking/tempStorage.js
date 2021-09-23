'use es6';

import { getCookie } from 'hub-http/helpers/cookies';

var setCookie = function setCookie(key, value) {
  var expiresInMillis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 60 * 24 * 60 * 60 * 1000;
  var currentTime = new Date();
  var expiryTime = new Date(currentTime.setTime(currentTime.getTime() + expiresInMillis)).toUTCString();
  document.cookie = key + "=" + value + ";expires=" + expiryTime + ";path=/";
};

export var getTempStorage = function getTempStorage() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var value = '';

  try {
    value = window.localStorage.getItem(key) || '';
  } catch (err) {
    value = getCookie(key, document.cookie);
  }

  return value;
};
export var setTempStorage = function setTempStorage() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  try {
    window.localStorage.setItem(key, value);
  } catch (err) {
    setCookie(key, value);
  }

  return value;
};