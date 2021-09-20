import { memoize } from './utils/js_utils';
export var isFirefox = memoize(function () {
  return /firefox/i.test(navigator.userAgent);
});
export var isSafari = memoize(function () {
  return Boolean(window.safari);
});