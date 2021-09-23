import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import enviro from 'enviro';
import { NAMESPACE_SUFFIX } from './constants';
export var storageAvailable = function storageAvailable() {
  var storage;

  try {
    storage = window.localStorage;
    var x = '__storage_test__';
    storage.setItem(x, x);
    storage.getItem(x);
    storage.removeItem(x);
  } catch (e) {
    throw new Error('Backend error: LocalStorage is unavailable.');
  }
};

var accessor = function accessor(operation) {
  try {
    return operation();
  } catch (e) {
    if (e.message && e.message.match('Usage error')) {
      throw e;
    } else {
      throw new Error("Backend error: LocalStorage failed with the following error: " + e.message);
    }
  }
};

export var isStorable = function isStorable(value) {
  if (typeof value === 'string') return true;
  if (typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'toString')) return true;

  if (typeof value === 'boolean' || typeof value === 'number' || value === null || value === undefined) {
    if (enviro.getShort() !== 'prod') {
      console.warn("value `" + value + "` will be cast to a string when stored in localStorage but won't be cast back when retrieved. Watch out for type safety.");
    }

    return true;
  }

  return false;
};

/**
 * Superstore backend which uses the browser's LocalStorage API. This backend prioritizes simplicity over durability or performance.
 *
 * This backend's API supports two interfaces: synchronous and async. The synchronous API will be more familiar to users
 * of the SafeStorage utility or the underlying LocalStorage API, but the async API offers better error handling and an
 * easier migration path to more complex data storage scenarios (for which you will need to implement a backend that
 * requires async).
 *
 * To create a Superstore instance using this backend:
 *
 * ```js
 * import Superstore, { LocalStorage } from 'superstore';
 *
 * // create an async superstore (default)
 * const store = new Superstore({
 *   backend: LocalStorage,
 *   namespace: 'example',
 * });
 *
 * // create a synchronous superstore
 * const storeSync = new Superstore({
 *   backend: LocalStorage,
 *   async: false,
 *   namespace: 'example',
 * });
 * ```
 */
export var SuperstoreLocal = /*#__PURE__*/function () {
  /** @hidden */

  /** @hidden */

  /** @hidden */
  function SuperstoreLocal(opts) {
    _classCallCheck(this, SuperstoreLocal);

    this.getItem = SuperstoreLocal.prototype.get;
    this.setItem = SuperstoreLocal.prototype.set;
    this.removeItem = SuperstoreLocal.prototype.delete;
    this.accessor = accessor;
    this.namespace = opts.namespace;
    this.inmemory = {};
    storageAvailable();

    if (opts && opts.async) {
      this.accessor = function (operation) {
        return new Promise(function (resolve, reject) {
          try {
            resolve(operation());
          } catch (e) {
            if (e.message && e.message.match('Usage error')) {
              throw e;
            } else {
              reject(new Error("Backend error: LocalStorage failed with the following error: " + e.message));
            }
          }
        });
      };
    }
  }
  /**
   * Supplement the key with the database and namespace path components.
   * This doesn't actually do anything in localstorage but it keeps parity with IDB.
   */


  _createClass(SuperstoreLocal, [{
    key: "fullKey",
    value: function fullKey(key) {
      return this.namespace + "." + NAMESPACE_SUFFIX + "." + key;
    }
    /**
     * Check if key exists in LocalStorage.
     *
     * ```js
     * // async
     * store.has('foo')
     *   .then(fooExists => {
     *     // fooExists === true, if you previously called `store.set('foo', something)`
     *   })
     *   .catch(dispatchError);
     * ```
     *
     * ```js
     * // sync
     * try {
     *   const fooExists = store.has('foo');
     *     // fooExists === true, if you previously called `store.set('foo', something)`
     * } catch (e) {
     *   // handle the errors this function throws
     * }
     * ```
     *
     * @param key - Key in localstorage to check existence of
     */

  }, {
    key: "has",
    value: function has(key) {
      var _this = this;

      if (!key) {
        return this.accessor(function () {
          throw new Error('Usage error: `has` requires `key` argument to be defined');
        });
      }

      if (typeof key !== 'string') {
        return this.accessor(function () {
          throw new Error("Usage error: LocalStorage doesn't support non-string keys. Consider implementing the IndexedDB backend.");
        });
      }

      return this.accessor(function () {
        return window.localStorage.getItem(_this.fullKey(key)) !== null;
      });
    }
    /**
     * Get value from LocalStorage.
     *
     * ```js
     * // async
     * store.get('foo')
     *   .then(val => {
     *     // `val` will be whatever you used as `val` in `store.set('foo', val)`
     *   })
     *   .catch(dispatchError);
     * ```
     *
     * ```js
     * // sync
     * let storedFoo
     * try {
     *   storedFoo = store.get('foo');
     *   assert(storedFoo === 'bar');
     * } catch (e) {
     *   // handle the errors this function throws
     * }
     * ```
     *
     * @param key - Key in localstorage to get
     */

  }, {
    key: "get",
    value: function get(key) {
      var _this2 = this;

      if (!key) {
        return this.accessor(function () {
          throw new Error('Usage error: `get` requires `key` argument to be defined');
        });
      }

      if (typeof key !== 'string') {
        return this.accessor(function () {
          throw new Error("Usage error: LocalStorage doesn't support non-string keys. Consider implementing the IndexedDB backend.");
        });
      }

      return this.accessor(function () {
        return window.localStorage.getItem(_this2.fullKey(key));
      });
    }
    /**
     * Set a value in LocalStorage.
     *
     * ```js
     * // async
     * store.set('foo', 'bar')
     *   .then(dispatchSuccess)
     *   .catch(dispatchError);
     * ```
     *
     * ```js
     * // sync
     * try {
     *   store.set('foo', 'bar');
     * } catch (e) {
     *   // handle the errors this function throws
     * }
     * ```
     *
     * @param key - Key in localstorage to set
     * @param value - Value to store under given key
     */

  }, {
    key: "set",
    value: function set(key, value) {
      var _this3 = this;

      if (!key || value === undefined) {
        return this.accessor(function () {
          throw new Error('Usage error: `set` requires `key` and `value` arguments both to be defined');
        });
      }

      if (typeof key !== 'string') {
        return this.accessor(function () {
          throw new Error("Usage error: LocalStorage doesn't support non-string keys. Consider implementing the IndexedDB backend.");
        });
      }

      if (!isStorable(value)) {
        return this.accessor(function () {
          throw new Error("Usage error: LocalStorage doesn't support values of type " + typeof value + ". Consider implementing the IndexedDB backend.");
        });
      }

      return this.accessor(function () {
        var fqKey = _this3.fullKey(key);

        window.localStorage.setItem(fqKey, value);
        var storedVal = window.localStorage.getItem(fqKey);
        _this3.inmemory[fqKey] = storedVal;
        return storedVal;
      });
    }
    /**
     * Delete value from LocalStorage.
     *
     * ```js
     * // async
     * store.delete('foo')
     *   .then(foo => {
     *     // `foo` is the value set under key foo, if you need it
     *     return store.has('foo');
     *   })
     *   .then(fooExists => {
     *     // fooExists === false
     *   })
     *   .catch(dispatchError);
     * ```
     *
     * ```js
     * // sync
     * try {
     *   store.delete('foo'); // returns 'bar'
     *   const fooExists = store.has('foo');
     *   // fooExists === false
     * } catch (e) {
     *   // handle the errors this function throws
     * }
     * ```
     *
     * @param key - Key in localstorage to delete
     *
     */

  }, {
    key: "delete",
    value: function _delete(key) {
      var _this4 = this;

      if (!key) {
        return this.accessor(function () {
          throw new Error('Usage error: `get` requires `key` argument to be defined');
        });
      }

      if (typeof key !== 'string') {
        return this.accessor(function () {
          throw new Error("Usage error: LocalStorage doesn't support non-string keys. Consider implementing the IndexedDB backend.");
        });
      }

      return this.accessor(function () {
        var fqKey = _this4.fullKey(key);

        var res = window.localStorage.getItem(fqKey);
        window.localStorage.removeItem(fqKey);
        delete _this4.inmemory[fqKey];
        return res;
      });
    }
    /**
     * Remove all keys and values from this namespace in LocalStorage.
     *
     *
     * ```js
     * // async
     * store.clear()
     *   .then(() => store.has('foo'))
     *   .then(fooExists => {
     *     // fooExists === false
     *   })
     *   .catch(dispatchError);
     * ```
     *
     * ```js
     * // sync
     * try {
     *   store.clear();
     *   const fooExists = store.has('foo');
     *   // fooExists === false
     * } catch (e) {
     *   // handle the errors this function throws
     * }
     * ```
     *
     */

  }, {
    key: "clear",
    value: function clear() {
      var _this5 = this;

      return this.accessor(function () {
        Object.keys(_this5.inmemory).forEach(function (fqKey) {
          return window.localStorage.removeItem(fqKey);
        });
        _this5.inmemory = {};
      });
    }
    /* eslint-disable @typescript-eslint/unbound-method */

    /** Alias for `get` to aid in migration from SafeStorage. */

    /* eslint-enable @typescript-eslint/unbound-method */

  }]);

  return SuperstoreLocal;
}();
export default function localSuperstore(opts) {
  return new SuperstoreLocal(opts);
}