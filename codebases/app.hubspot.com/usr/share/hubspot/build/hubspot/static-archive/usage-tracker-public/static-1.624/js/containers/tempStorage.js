'use es6';

import * as cookieHelper from '../helpers/cookieHelper';
var hasLocalStorage = false;

try {
  hasLocalStorage = window && window.localStorage;
} catch (err) {
  /* noop */
}

export var get = function get() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var value = '';

  if (hasLocalStorage) {
    try {
      value = window.localStorage.getItem(key) || '';
    } catch (err) {
      value = cookieHelper.get(key);
    }
  }

  return value;
};
export var set = function set() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (hasLocalStorage) {
    try {
      window.localStorage.setItem(key, value || '');
    } catch (err) {
      cookieHelper.set(key, value);
    }
  }

  return value;
};