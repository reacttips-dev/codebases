'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import { debug } from '../util/DebugUtil';
import { isLocalStorageAvailable } from '../util/StorageUtil';
import EventManager from './EventManager';

var StorageManager = /*#__PURE__*/function () {
  function StorageManager(storage) {
    _classCallCheck(this, StorageManager);

    this.handleStorageEvent = this.handleStorageEvent.bind(this);
    this.eventManager = new EventManager();
    this.namespace = ''; // localStorage is mocked if not available or if an object is passed (eg for unit testing)

    if (storage || !isLocalStorageAvailable()) {
      this.storage = storage || {};
    } else {
      window.addEventListener('storage', this.handleStorageEvent);
    }
  }

  _createClass(StorageManager, [{
    key: "setNamespace",
    value: function setNamespace(namespace) {
      this.namespace = namespace;
    }
  }, {
    key: "setKey",
    value: function setKey(key, subKey) {
      this.storageKey = key;
      this.storageSubKey = subKey;
    }
  }, {
    key: "getNamespacedKey",
    value: function getNamespacedKey(key) {
      return this.namespace ? this.namespace + "-" + key : key;
    }
  }, {
    key: "getItem",
    value: function getItem(key) {
      try {
        var namespacedKey = this.getNamespacedKey(key);

        if (this.storage) {
          if (this.storageKey) {
            return this.storage[this.storageKey][this.storageSubKey][namespacedKey];
          }

          return this.storage[namespacedKey];
        }

        if (this.storageKey) {
          return JSON.parse(localStorage.getItem(this.storageKey))[this.storageSubKey][namespacedKey];
        }

        return JSON.parse(localStorage.getItem(namespacedKey));
      } catch (error) {
        debug('Error while reading localStorage value:', error);
        return null;
      }
    }
  }, {
    key: "setItem",
    value: function setItem(key, value) {
      var namespacedKey = this.getNamespacedKey(key);
      var storageKey = this.storageKey || namespacedKey;
      var storageValue = value;

      if (this.storageKey) {
        var oldValue;

        try {
          oldValue = this.storage ? this.storage[this.storageKey][this.storageSubKey] : JSON.parse(localStorage.getItem(this.storageKey))[this.storageSubKey];
        } catch (error) {
          debug('Error while writing localStorage value:', error);
          oldValue = {};
        }

        storageValue = _defineProperty({}, this.storageSubKey, Object.assign({}, oldValue, _defineProperty({}, namespacedKey, value)));
      }

      if (this.storage) {
        this.storage[storageKey] = storageValue;
        this.eventManager.trigger(key, value);
      } else {
        try {
          localStorage.setItem(storageKey, JSON.stringify(storageValue)); // Only trigger the events if it successfully added to localStorage,
          // otherwise we end up in an infinite loop

          this.eventManager.trigger(key, value);
        } catch (exception) {// Problem with local storage - full / corrupt / etc. Ignore the error
          // as we can't fix
        }
      }
    } // Force output to be an array

  }, {
    key: "getArrayItem",
    value: function getArrayItem(key) {
      var value = this.getItem(key);
      return Array.isArray(value) ? value : [];
    } // Push element into an array value in storage

  }, {
    key: "pushItem",
    value: function pushItem(key, value) {
      this.setItem(key, this.getArrayItem(key).concat([value]));
    } // Remove element from an array value in storage

  }, {
    key: "removeArrayItem",
    value: function removeArrayItem(key, targetValue) {
      this.setItem(key, this.getArrayItem(key).filter(function (value) {
        return value !== targetValue;
      }));
    } // Move element in an array value in storage to index 0

  }, {
    key: "moveItemToFront",
    value: function moveItemToFront(key, targetValue) {
      this.setItem(key, [targetValue].concat(_toConsumableArray(this.getArrayItem(key).filter(function (value) {
        return value !== targetValue;
      }))));
    } // Callbacks

  }, {
    key: "handleStorageEvent",
    value: function handleStorageEvent(_ref) {
      var key = _ref.key,
          newValue = _ref.newValue,
          oldValue = _ref.oldValue;
      var changedKey;

      if (!this.storageKey) {
        changedKey = key;
      } else if (key && this.storageKey === key) {
        changedKey = null;

        try {
          var parsedOldValue = JSON.parse(oldValue)[this.storageSubKey];
          var parsedNewValue = JSON.parse(newValue)[this.storageSubKey];
          var keys = [].concat(_toConsumableArray(Object.keys(parsedOldValue)), _toConsumableArray(Object.keys(parsedNewValue)));
          changedKey = keys.find(function (k) {
            return JSON.stringify(parsedOldValue[k]) !== JSON.stringify(parsedNewValue[k]);
          });
        } catch (error) {
          debug('Error while parsing localStorage value:', error);
        }
      }

      if (changedKey && changedKey.indexOf(this.namespace) > -1) {
        var eventName = changedKey.replace(this.namespace + "-", '');
        this.eventManager.trigger(eventName, this.getItem(eventName));
      }
    }
  }, {
    key: "removeItemChangeListener",
    value: function removeItemChangeListener(key, callback) {
      this.eventManager.removeEventListener(key, callback);
    }
  }, {
    key: "onItemChange",
    value: function onItemChange(key, callback) {
      this.eventManager.addEventListener(key, callback);
    }
  }]);

  return StorageManager;
}();

export { StorageManager as default };