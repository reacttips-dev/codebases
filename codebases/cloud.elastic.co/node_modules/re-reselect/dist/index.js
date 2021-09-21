(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('reselect')) :
  typeof define === 'function' && define.amd ? define(['exports', 'reselect'], factory) :
  (global = global || self, factory(global['Re-reselect'] = {}, global.Reselect));
}(this, function (exports, reselect) { 'use strict';

  function isStringOrNumber(value) {
    return typeof value === 'string' || typeof value === 'number';
  }

  var FlatObjectCache =
  /*#__PURE__*/
  function () {
    function FlatObjectCache() {
      this._cache = {};
    }

    var _proto = FlatObjectCache.prototype;

    _proto.set = function set(key, selectorFn) {
      this._cache[key] = selectorFn;
    };

    _proto.get = function get(key) {
      return this._cache[key];
    };

    _proto.remove = function remove(key) {
      delete this._cache[key];
    };

    _proto.clear = function clear() {
      this._cache = {};
    };

    _proto.isValidCacheKey = function isValidCacheKey(cacheKey) {
      return isStringOrNumber(cacheKey);
    };

    return FlatObjectCache;
  }();

  var defaultCacheCreator = FlatObjectCache;

  var defaultCacheKeyValidator = function defaultCacheKeyValidator() {
    return true;
  };

  function createCachedSelector() {
    for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
      funcs[_key] = arguments[_key];
    }

    return function (polymorphicOptions, legacyOptions) {
      // @NOTE Versions 0.x/1.x accepted "options" as a function
      if (typeof legacyOptions === 'function') {
        throw new Error('[re-reselect] Second argument "options" must be an object. Please use "options.selectorCreator" to provide a custom selectorCreator.');
      }

      var options = {};

      if (typeof polymorphicOptions === 'function') {
        Object.assign(options, legacyOptions, {
          keySelector: polymorphicOptions
        }); // @TODO add legacyOptions deprecation notice in next major release
      } else {
        Object.assign(options, polymorphicOptions);
      } // https://github.com/reduxjs/reselect/blob/v4.0.0/src/index.js#L54


      var recomputations = 0;
      var resultFunc = funcs.pop();
      var dependencies = Array.isArray(funcs[0]) ? funcs[0] : [].concat(funcs);

      var resultFuncWithRecomputations = function resultFuncWithRecomputations() {
        recomputations++;
        return resultFunc.apply(void 0, arguments);
      };

      funcs.push(resultFuncWithRecomputations);
      var cache = options.cacheObject || new defaultCacheCreator();
      var selectorCreator = options.selectorCreator || reselect.createSelector;
      var isValidCacheKey = cache.isValidCacheKey || defaultCacheKeyValidator;

      if (options.keySelectorCreator) {
        options.keySelector = options.keySelectorCreator({
          keySelector: options.keySelector,
          inputSelectors: dependencies,
          resultFunc: resultFunc
        });
      } // Application receives this function


      var selector = function selector() {
        var cacheKey = options.keySelector.apply(options, arguments);

        if (isValidCacheKey(cacheKey)) {
          var cacheResponse = cache.get(cacheKey);

          if (cacheResponse === undefined) {
            cacheResponse = selectorCreator.apply(void 0, funcs);
            cache.set(cacheKey, cacheResponse);
          }

          return cacheResponse.apply(void 0, arguments);
        }

        console.warn("[re-reselect] Invalid cache key \"" + cacheKey + "\" has been returned by keySelector function.");
        return undefined;
      }; // Further selector methods


      selector.getMatchingSelector = function () {
        var cacheKey = options.keySelector.apply(options, arguments); // @NOTE It might update cache hit count in LRU-like caches

        return cache.get(cacheKey);
      };

      selector.removeMatchingSelector = function () {
        var cacheKey = options.keySelector.apply(options, arguments);
        cache.remove(cacheKey);
      };

      selector.clearCache = function () {
        cache.clear();
      };

      selector.resultFunc = resultFunc;
      selector.dependencies = dependencies;
      selector.cache = cache;

      selector.recomputations = function () {
        return recomputations;
      };

      selector.resetRecomputations = function () {
        return recomputations = 0;
      };

      selector.keySelector = options.keySelector;
      return selector;
    };
  }

  function createStructuredCachedSelector(selectors) {
    return reselect.createStructuredSelector(selectors, createCachedSelector);
  }

  function validateCacheSize(cacheSize) {
    if (cacheSize === undefined) {
      throw new Error('Missing the required property "cacheSize".');
    }

    if (!Number.isInteger(cacheSize) || cacheSize <= 0) {
      throw new Error('The "cacheSize" property must be a positive integer value.');
    }
  }

  var FifoObjectCache =
  /*#__PURE__*/
  function () {
    function FifoObjectCache(_temp) {
      var _ref = _temp === void 0 ? {} : _temp,
          cacheSize = _ref.cacheSize;

      validateCacheSize(cacheSize);
      this._cache = {};
      this._cacheOrdering = [];
      this._cacheSize = cacheSize;
    }

    var _proto = FifoObjectCache.prototype;

    _proto.set = function set(key, selectorFn) {
      this._cache[key] = selectorFn;

      this._cacheOrdering.push(key);

      if (this._cacheOrdering.length > this._cacheSize) {
        var earliest = this._cacheOrdering[0];
        this.remove(earliest);
      }
    };

    _proto.get = function get(key) {
      return this._cache[key];
    };

    _proto.remove = function remove(key) {
      var index = this._cacheOrdering.indexOf(key);

      if (index > -1) {
        this._cacheOrdering.splice(index, 1);
      }

      delete this._cache[key];
    };

    _proto.clear = function clear() {
      this._cache = {};
      this._cacheOrdering = [];
    };

    _proto.isValidCacheKey = function isValidCacheKey(cacheKey) {
      return isStringOrNumber(cacheKey);
    };

    return FifoObjectCache;
  }();

  var LruObjectCache =
  /*#__PURE__*/
  function () {
    function LruObjectCache(_temp) {
      var _ref = _temp === void 0 ? {} : _temp,
          cacheSize = _ref.cacheSize;

      validateCacheSize(cacheSize);
      this._cache = {};
      this._cacheOrdering = [];
      this._cacheSize = cacheSize;
    }

    var _proto = LruObjectCache.prototype;

    _proto.set = function set(key, selectorFn) {
      this._cache[key] = selectorFn;

      this._registerCacheHit(key);

      if (this._cacheOrdering.length > this._cacheSize) {
        var earliest = this._cacheOrdering[0];
        this.remove(earliest);
      }
    };

    _proto.get = function get(key) {
      this._registerCacheHit(key);

      return this._cache[key];
    };

    _proto.remove = function remove(key) {
      this._deleteCacheHit(key);

      delete this._cache[key];
    };

    _proto.clear = function clear() {
      this._cache = {};
      this._cacheOrdering = [];
    };

    _proto._registerCacheHit = function _registerCacheHit(key) {
      this._deleteCacheHit(key);

      this._cacheOrdering.push(key);
    };

    _proto._deleteCacheHit = function _deleteCacheHit(key) {
      var index = this._cacheOrdering.indexOf(key);

      if (index > -1) {
        this._cacheOrdering.splice(index, 1);
      }
    };

    _proto.isValidCacheKey = function isValidCacheKey(cacheKey) {
      return isStringOrNumber(cacheKey);
    };

    return LruObjectCache;
  }();

  var FlatMapCache =
  /*#__PURE__*/
  function () {
    function FlatMapCache() {
      this._cache = new Map();
    }

    var _proto = FlatMapCache.prototype;

    _proto.set = function set(key, selectorFn) {
      this._cache.set(key, selectorFn);
    };

    _proto.get = function get(key) {
      return this._cache.get(key);
    };

    _proto.remove = function remove(key) {
      this._cache["delete"](key);
    };

    _proto.clear = function clear() {
      this._cache.clear();
    };

    return FlatMapCache;
  }();

  var FifoMapCache =
  /*#__PURE__*/
  function () {
    function FifoMapCache(_temp) {
      var _ref = _temp === void 0 ? {} : _temp,
          cacheSize = _ref.cacheSize;

      validateCacheSize(cacheSize);
      this._cache = new Map();
      this._cacheSize = cacheSize;
    }

    var _proto = FifoMapCache.prototype;

    _proto.set = function set(key, selectorFn) {
      this._cache.set(key, selectorFn);

      if (this._cache.size > this._cacheSize) {
        var earliest = this._cache.keys().next().value;

        this.remove(earliest);
      }
    };

    _proto.get = function get(key) {
      return this._cache.get(key);
    };

    _proto.remove = function remove(key) {
      this._cache["delete"](key);
    };

    _proto.clear = function clear() {
      this._cache.clear();
    };

    return FifoMapCache;
  }();

  var LruMapCache =
  /*#__PURE__*/
  function () {
    function LruMapCache(_temp) {
      var _ref = _temp === void 0 ? {} : _temp,
          cacheSize = _ref.cacheSize;

      validateCacheSize(cacheSize);
      this._cache = new Map();
      this._cacheSize = cacheSize;
    }

    var _proto = LruMapCache.prototype;

    _proto.set = function set(key, selectorFn) {
      this._cache.set(key, selectorFn);

      if (this._cache.size > this._cacheSize) {
        var earliest = this._cache.keys().next().value;

        this.remove(earliest);
      }
    };

    _proto.get = function get(key) {
      var value = this._cache.get(key); // Register cache hit


      if (this._cache.has(key)) {
        this.remove(key);

        this._cache.set(key, value);
      }

      return value;
    };

    _proto.remove = function remove(key) {
      this._cache["delete"](key);
    };

    _proto.clear = function clear() {
      this._cache.clear();
    };

    return LruMapCache;
  }();

  exports.FifoCacheObject = FifoObjectCache;
  exports.FifoMapCache = FifoMapCache;
  exports.FifoObjectCache = FifoObjectCache;
  exports.FlatCacheObject = FlatObjectCache;
  exports.FlatMapCache = FlatMapCache;
  exports.FlatObjectCache = FlatObjectCache;
  exports.LruCacheObject = LruMapCache;
  exports.LruMapCache = LruMapCache;
  exports.LruObjectCache = LruObjectCache;
  exports.createStructuredCachedSelector = createStructuredCachedSelector;
  exports.default = createCachedSelector;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
