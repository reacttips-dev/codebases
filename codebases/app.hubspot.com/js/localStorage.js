'use es6';

function hasLocalStorage() {
  return window && window.localStorage;
}

export function localStorageGet(key) {
  if (!hasLocalStorage()) {
    return null;
  }

  return window.localStorage.getItem(key);
}
export function localStorageSet(key, value) {
  if (hasLocalStorage()) {
    window.localStorage.setItem(key, value);
  }
}
export function localStorageRemove(key) {
  if (hasLocalStorage()) {
    window.localStorage.removeItem(key);
  }
}