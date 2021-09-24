'use es6';

export function getStorageItem(key) {
  var value;

  try {
    value = localStorage.getItem(key);
  } catch (e) {// Do nothing
  }

  return value;
}
export function isLocalStorageAvailable() {
  var KEY_TEST = 'CROSS_TAB_TEST_KEY';
  var isAvailable = !!window.localStorage;

  if (isAvailable) {
    try {
      // Safari private mode has localStorage but will throw an error on `setItem`
      localStorage.setItem(KEY_TEST, '');
      localStorage.removeItem(KEY_TEST);
    } catch (error) {
      isAvailable = false;
    }
  }

  return isAvailable;
}