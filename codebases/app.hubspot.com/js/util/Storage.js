'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

var Storage = /*#__PURE__*/function () {
  function Storage(storage) {
    _classCallCheck(this, Storage);

    if (storage === false) {
      this.storageEnabled = false;
    } else {
      this.localStorage = storage;
      this.storageEnabled = null;
    }
  }

  _createClass(Storage, [{
    key: "isStorageEnabled",
    value: function isStorageEnabled() {
      if (this.storageEnabled !== null) {
        return this.storageEnabled;
      }

      try {
        var testKey = 'firealarm-test';
        var time = Date.now();
        this.localStorage.setItem(testKey, time);
        this.storageEnabled = this.localStorage.getItem(testKey) == time;
        this.localStorage.removeItem(testKey);
      } catch (e) {
        this.storageEnabled = false;
      }

      return this.storageEnabled;
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      if (this.isStorageEnabled()) {
        return this.localStorage.getItem(key);
      }

      return null;
    }
  }, {
    key: "removeItem",
    value: function removeItem(key) {
      if (this.isStorageEnabled()) {
        this.localStorage.removeItem(key);
      }
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      if (this.isStorageEnabled()) {
        this.localStorage.setItem(key, value);
      }
    }
  }]);

  return Storage;
}();

;
export default Storage;