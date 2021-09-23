import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";

// https://github.com/microsoft/TypeScript/issues/1863

/**
 * @param {any} key
 * @return {boolean} `true` if this is a valid `WeakMap` key, `false` otherwise
 */
var isObject = function isObject(key) {
  return typeof key === 'object' && key != null || typeof key === 'function';
};
/**
 * @param {Object} object
 * @return {boolean} `true` if this is an Immutable-style object with `hashCode()` and `equals()`
 */


var isHashable = function isHashable(object) {
  return typeof object.hashCode === 'function' && typeof object.equals === 'function';
};
/**
 * @param {string|number|boolean|symbol} primitive
 * @return {string|symbol} An object key that's unique to this primitive
 */


var primitiveKey = function primitiveKey(primitive) {
  return typeof primitive === 'symbol' ? primitive : typeof primitive + "-" + primitive;
};
/**
 * A `CacheLayer` may contain any mix of:
 * 1. A value (`getValue()`)
 * 2. Nested layers (`get(key)`)
 */


export var CacheLayer = /*#__PURE__*/function () {
  // eslint-disable-next-line no-restricted-globals
  function CacheLayer() {
    _classCallCheck(this, CacheLayer);

    this.objectCache = null;
    this.hashableCache = null;
    this.primitiveCache = null;
    this.value = null;
  }

  _createClass(CacheLayer, [{
    key: "get",
    value: function get(key) {
      if (isObject(key)) {
        if (isHashable(key) && this.hashableCache) {
          var hashableCacheResult = this.hashableCache[key.hashCode()];

          if (hashableCacheResult && key.equals(hashableCacheResult[0])) {
            return hashableCacheResult[1];
          }
        }

        return this.objectCache && this.objectCache.get(key);
      }

      return this.primitiveCache && this.primitiveCache[primitiveKey(key)];
    }
  }, {
    key: "set",
    value: function set(key, cacheLayer) {
      if (isObject(key)) {
        if (isHashable(key)) {
          if (!this.hashableCache) this.hashableCache = Object.create(null);
          this.hashableCache[key.hashCode()] = [key, cacheLayer];
        } // eslint-disable-next-line no-restricted-globals


        if (!this.objectCache) this.objectCache = new WeakMap();
        this.objectCache.set(key, cacheLayer);
        return;
      }

      if (!this.primitiveCache) this.primitiveCache = Object.create(null);
      this.primitiveCache[primitiveKey(key)] = cacheLayer;
    }
  }, {
    key: "getValue",
    value: function getValue() {
      return this.value;
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      this.value = value;
    }
  }]);

  return CacheLayer;
}();
/**
 * Retrieves a value from a layered cache, if that value exists.
 * @param {CacheLayer} cacheLayer
 * @param {...any} nestedKeys
 * @return {any}
 */

export var cacheGet = function cacheGet(cacheLayer, nestedKeys) {
  var layer = cacheLayer;

  for (var i = 0; i < nestedKeys.length; i++) {
    if (!layer) return null;
    var nextLayer = layer.get(nestedKeys[i]);
    layer = nextLayer;
  }

  return layer && layer.getValue();
};
/**
 * Inserts a value into a layered cache.
 */

export var cachePut = function cachePut(cacheLayer, nestedKeys, value) {
  var layer = cacheLayer;
  nestedKeys.forEach(function (key) {
    var nextLayer = layer.get(key);

    if (!nextLayer) {
      nextLayer = new CacheLayer();
      layer.set(key, nextLayer);
    }

    layer = nextLayer;
  });
  layer.setValue(value);
};