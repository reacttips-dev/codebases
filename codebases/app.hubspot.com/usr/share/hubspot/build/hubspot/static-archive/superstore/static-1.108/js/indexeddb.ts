import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import testQuota from './utils/quota';
import { NULL_REPR, NAMESPACE_SUFFIX } from './constants';

var isNullRepr = function isNullRepr(val) {
  try {
    if (typeof val === 'object') {
      var reprKeys = Object.keys(NULL_REPR);
      var valKeys = Object.keys(val);

      if (reprKeys.length === valKeys.length) {
        return reprKeys.every(function (key) {
          var foundKey = valKeys[valKeys.indexOf(key)];
          return NULL_REPR[key] === val[foundKey];
        });
      }
    }

    return false;
  } catch (e) {
    return false;
  }
};

var unsupported = new Error('IndexedDB is not supported in this environment.');
var defaultHandlers = {
  error: function error(_ref, _ref2) {
    var _error = _ref.error;
    var reject = _ref2.reject;
    return reject(new Error(_error && _error.message || 'Unknown backend error'));
  },
  success: function success(_ref3, _ref4) {
    var result = _ref3.result;
    var resolve = _ref4.resolve;
    return resolve(result);
  }
};
/**
 * Wrap an IndexedDB operation in a Promise. Use this if you plan
 * on building custom things, e.g. with indexes or cursors.
 *
 * @param klass - IndexedDB API where the operation you want to wrap is declared (e.g., IDBObjectStore)
 * @param method - name of the operation to be wrapped in a Promise, as a string
 * @param args - array of the arguments you will pass to this API
 */

export var wrapCall = function wrapCall(klass, method) {
  var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  var handlers = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : defaultHandlers;
  var externalRequest = arguments.length > 4 ? arguments[4] : undefined;
  var retry = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  return new Promise(function (resolve, reject) {
    try {
      var _ref5;

      var request = (_ref5 = klass)[method].apply(_ref5, _toConsumableArray(args));

      if (!request && externalRequest) {
        request = externalRequest;
      } else if (!request) {
        reject(new Error('the wrapped call did not return an event'));
      }

      Object.keys(handlers).forEach(function (eventName) {
        var eventHandler = handlers[eventName];
        request.addEventListener(eventName, function () {
          return eventHandler(request, {
            resolve: resolve,
            reject: reject
          });
        }, {
          once: true
        });
      });
    } catch (e) {
      if (retry && klass instanceof IDBObjectStore && e.name === 'TransactionInactiveError') {
        // IE11 likes to render transactions inactive after every single operation.
        // Try creating a new transaction and running the operation again.
        var _klass$transaction = klass.transaction,
            mode = _klass$transaction.mode,
            db = _klass$transaction.db;
        var transaction = db.transaction(klass.name, mode);
        var store = transaction.objectStore(klass.name);
        wrapCall(store, method, args, handlers, externalRequest, false).then(resolve).catch(reject);
      } else {
        reject(e);
      }
    }
  });
};

var commit = function commit(transaction) {
  if (transaction && transaction.commit && typeof transaction.commit === 'function') {
    return wrapCall(transaction, 'commit', [], Object.assign({}, defaultHandlers, {
      complete: function complete(_ref6, _ref7) {
        var result = _ref6.result;
        var resolve = _ref7.resolve;
        return resolve(result);
      }
    }), transaction);
  } else {
    // IDBTransaction.commit() is only implemented in browsers supporting IndexedDB 3.0
    // Other browsers will just autocommit.
    return Promise.resolve();
  }
};
/**
 * Superstore backend which uses the browser's IndexedDB API. Compared to the LocalStorage backend,
 * IndexedDB can store more kinds of keys and values, is more durable, offers higher performance and more storage.
 *
 * IndexedDB is supported in all HubSpot supported browsers.
 *
 * This backend only supports asynchronous calls. Make sure to catch promise rejections.
 *
 * To create a Superstore instance using this backend:
 *
 * ```js
 * import Superstore, { IndexedDB } from 'superstore';
 *
 * const conn = new Superstore({
 *   backend: IndexedDB,
 *   namespace: 'example',
 * });
 * conn.open().then(store => {
 *   store.set('foo', bar)
 * });
 * ```
 *
 */


export var SuperstoreIDB = /*#__PURE__*/function () {
  /** @hidden */

  /** @hidden */

  /** @hidden */
  function SuperstoreIDB(opts) {
    _classCallCheck(this, SuperstoreIDB);

    if (!opts.async) {
      throw new Error('The IndexedDB backend only supports asynchronous calls.');
    }

    this._database = undefined;
    this._objectStoreName = NAMESPACE_SUFFIX;
    this._dbName = opts.namespace;
  }
  /**
   * Must be called before any operations on the database.
   * @hidden
   */


  _createClass(SuperstoreIDB, [{
    key: "_checkInit",
    value: function _checkInit() {
      if (!this._database) {
        return Promise.reject(new Error('No backend connection is open. Open a new database or connect to an existing one using .open()'));
      }

      return Promise.resolve();
    }
    /**
     * Open a connection to an IndexedDB database and create a store inside it.
     * To ensure the best performance, re-use open connections rather than calling this method repeatedly.
     *
     * ```js
     * new Superstore({ backend: IndexedDB })).open().then(store => {
     *   // store is ready for operations
     * });
     * ```
     */

  }, {
    key: "open",
    value: function open() {
      var _this = this;

      if (this._database) {
        return Promise.reject(new Error('A backend connection is already open. To open another connection, create a new Superstore instance.'));
      }

      try {
        // In Firefox, if cookies are disabled, just evaluating this expression throws a SecurityError.
        // In private mode, if cookies are enabled, it evaluates to null.
        if (!window.indexedDB) {
          return Promise.reject(unsupported);
        }
      } catch (_) {
        return Promise.reject(unsupported);
      }

      var openWithVersion = function openWithVersion() {
        var version = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
        return wrapCall(window.indexedDB, 'open', [_this._dbName, version], Object.assign({}, defaultHandlers, {
          upgradeneeded: function upgradeneeded(_ref8, _ref9) {
            var result = _ref8.result,
                transaction = _ref8.transaction;
            var resolve = _ref9.resolve;

            if (!result.objectStoreNames.contains(_this._objectStoreName)) {
              result.createObjectStore(_this._objectStoreName);
            }

            transaction.addEventListener('complete', function () {
              return resolve(result);
            }, {
              once: true
            });
          },
          blocked: function blocked(_, _ref10) {
            var reject = _ref10.reject;
            return reject(new Error("Superstore can't create a store because open connections are blocking it. Make sure you're closing your store connections with `.close()`."));
          }
        }));
      };

      return openWithVersion().then(function (db) {
        if (!db.objectStoreNames.contains(_this._objectStoreName)) {
          db.close(); // the current version doesn't have stores we need.
          // trigger a versionChange event and create a new object store.
          // (object store creation only works inside a versionchange transaction)
          // @TODO: if version > Number.MAX_SAFE_INTEGER, we're going to have to nuke the db

          return openWithVersion(db.version + 1).then(function (incrementedDB) {
            _this._database = incrementedDB;
            return _this;
          });
        } else {
          _this._database = db;
          return _this;
        }
      });
    }
    /**
     * Close the connection to the database. Data is not deleted.
     *
     * ```js
     * const conn = new Superstore({ backend: IndexedDB });
     * conn.open()
     *   .then(store => {
     *     // use the store
     *   })
     *   .then(() => conn.close())
     * ```
     */

  }, {
    key: "close",
    value: function close() {
      var _this2 = this;

      return this._checkInit().then(function () {
        _this2._database.close(); // yes, this is sync and void


        delete _this2._database; // don't worry, this doesn't actually delete the database, just the connection
      });
    }
    /**
     * Determine if there is a record in the store stored with `key`.
     * If `key` points to a value of undefined, the result is still true.
     *
     * ```js
     * store.has('key').then(keyExists => {
     *   // use the boolean `keyExists` value
     * });
     * ```
     */

  }, {
    key: "has",
    value: function has(key) {
      var _this3 = this;

      return this._checkInit().then(function () {
        return _this3._database.transaction(_this3._objectStoreName, 'readonly');
      }).then(function (transaction) {
        var store = transaction.objectStore(_this3._objectStoreName);
        return wrapCall(store, 'openCursor', [key]).then(function (cursor) {
          return commit(transaction).then(function () {
            return !!cursor;
          });
        });
      });
    }
    /**
     * Get the value in the store located by `key`.
     * If `key` doesn't point to anything, returns undefined.
     *
     * ```js
     * store.get('key').then(value => {
     *   // `value` will be whatever was stored addressed by `key`, or undefined
     * });
     * ```
     */

  }, {
    key: "get",
    value: function get(key) {
      var _this4 = this;

      return this._checkInit().then(function () {
        return _this4._database.transaction(_this4._objectStoreName, 'readonly');
      }).then(function (transaction) {
        var store = transaction.objectStore(_this4._objectStoreName);
        return wrapCall(store, 'get', [key]).then(function (value) {
          return commit(transaction).then(function () {
            return isNullRepr(value) ? null : value;
          });
        });
      });
    }
    /**
     * Set `value` in the store located by `key`.
     * Anything that works with [the structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm) can be stored.
     * If `key` already points to a value in this store, it will be overwritten with `value`.
     * Resolves with the set value.
     *
     * ```js
     * store.set('key', value).then(() => {
     *   // resolves with `value`, if you need it
     * });
     * ```
     */

  }, {
    key: "set",
    value: function set(key, value) {
      var _this5 = this;

      // IE and Edge can't store null as an indexeddb value. Force the value to something else before storing.
      if (value === null) {
        value = NULL_REPR;
      }

      return this._checkInit().then(testQuota).then(function () {
        return _this5._database.transaction(_this5._objectStoreName, 'readwrite');
      }).then(function (transaction) {
        var store = transaction.objectStore(_this5._objectStoreName);
        return wrapCall(store, 'openCursor', [key]).then(function (cursor) {
          return !!cursor;
        }).then(function (hasKey) {
          var addOrPut = hasKey ? 'put' : 'add';
          return wrapCall(store, addOrPut, [value, key]).then(function () {
            return commit(transaction).then(function () {
              return value;
            });
          });
        });
      });
    }
    /**
     * Delete the pair in the store located by `key`.
     * The method resolves regardless of whether `key` pointed to anything, as long as no errors were raised.
     * Resolves the deleted value, or undefined if nothing was deleted
     *
     * ```js
     * store.delete('key').then(value => {
     *   // `value` will be a structured clone of the second argument to store.set('key', value)
     * });
     * ```
     */

  }, {
    key: "delete",
    value: function _delete(key) {
      var _this6 = this;

      return this._checkInit().then(function () {
        return _this6._database.transaction(_this6._objectStoreName, 'readwrite');
      }).then(function (transaction) {
        var store = transaction.objectStore(_this6._objectStoreName);
        return wrapCall(store, 'get', [key]).then(function (value) {
          return wrapCall(store, 'delete', [key]).then(function () {
            return commit(transaction).then(function () {
              return value;
            });
          });
        });
      });
    }
    /**
     * Remove all keys, values and indexes from the namespace.
     * Does not destroy the store. An IDB database and object store will remain in place.
     *
     * ```js
     * store
     *   .set('foo', 'bar')
     *   .then(() => store.clear())
     *   .then(() => store.has('foo'))
     *   .then(fooExists => {
     *      // fooExists === false
     *    });
     * ```
     */

  }, {
    key: "clear",
    value: function clear() {
      var _this7 = this;

      return this._checkInit().then(function () {
        return _this7._database.transaction(_this7._objectStoreName, 'readwrite');
      }).then(function (transaction) {
        var store = transaction.objectStore(_this7._objectStoreName);
        return wrapCall(store, 'clear').then(function () {
          return commit(transaction);
        }).then();
      });
    }
  }]);

  return SuperstoreIDB;
}();
export default function (opts) {
  return new SuperstoreIDB(opts);
}