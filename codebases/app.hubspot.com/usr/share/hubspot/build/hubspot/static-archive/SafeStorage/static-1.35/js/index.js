'use es6';

var storage = {};
export default {
  getItem: function getItem(key) {
    if (this._isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    } else {
      return storage[key];
    }
  },
  setItem: function setItem(key, value) {
    if (this._isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    } else {
      storage[key] = value;
    }
  },
  removeItem: function removeItem(key) {
    if (this._isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    } else {
      delete storage[key];
    }
  },
  clear: function clear() {
    if (this._isLocalStorageAvailable()) {
      localStorage.clear();
    } else {
      storage = {};
    }
  },
  _isLocalStorageAvailable: function _isLocalStorageAvailable() {
    // test that localStorage exists and doesn't throw - based on https://github.com/Modernizr/Modernizr/blob/da22eb27631fc4957f67607fe6042e85c0a84656/feature-detects/storage/localstorage.js
    if (this.localStorageAvailable == null) {
      try {
        var testValue = 'SafeStorageTestValue';
        localStorage.setItem(testValue, testValue);
        this.localStorageAvailable = testValue === localStorage.getItem(testValue);
        localStorage.removeItem(testValue);
      } catch (e) {
        console.log('localStorage is not available:', e);
        this.localStorageAvailable = false;
      }
    }

    return this.localStorageAvailable;
  }
};