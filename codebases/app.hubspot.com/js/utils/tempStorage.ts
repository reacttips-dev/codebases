import { getCookie, setCookie } from './cookie';
var hasLocalStorage = false;

try {
  hasLocalStorage = !!(window && window.localStorage);
} catch (err) {
  /* Noop */
}

export var get = function get() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var value = '';

  if (hasLocalStorage) {
    try {
      value = window.localStorage[key] || '';
    } catch (err) {
      value = getCookie(key);
    }
  }

  return value;
};
export var set = function set() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  if (hasLocalStorage) {
    try {
      window.localStorage[key] = value || '';
    } catch (err) {
      setCookie(key, value);
    }
  }

  return value;
};
export var remove = function remove() {
  var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  if (hasLocalStorage && key) {
    try {
      window.localStorage.removeItem(key);
    } catch (err) {
      /* Noop */
    }
  }
};