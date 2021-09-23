import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { Map as ImmutableMap } from 'immutable';
import isDevelopment from './development';
import * as global from './global';
var DISABLE_CACHED = false;

var reportingDataModule = function reportingDataModule(line) {
  return line.split('reporting-data/static-1.23226/js')[1].split('.js')[0];
};

var staticArchiveModule = function staticArchiveModule(line) {
  var arr = line.split('.hubspot/static-archive/')[1].split('/');
  arr.splice(1, 2);
  return arr.join('/').split('.js')[0];
};

var getModule = function getModule() {
  if (isDevelopment()) {
    try {
      // @ts-expect-error remove this logic after data regression testing/cli is removed.
      var line = new Error().stack.split('\n')[3];
      return line.indexOf('.hubspot') !== -1 ? staticArchiveModule(line) : reportingDataModule(line);
    } catch (e) {
      return "err_module_from_stack";
    }
  }

  return null;
};

var caches = [];

var resetAll = function resetAll() {
  caches.forEach(function (cache) {
    return cache.reset();
  });
  caches = [];
};
/**
 * Value symbol
 *
 * @constant
 */


var Value = Symbol('@@value@@');
/**
 * Stat action types
 *
 * @constant
 */

var actions = {
  HIT: 'hit',
  MISS: 'miss',
  BUST: 'bust'
};
/**
 * Empty stats record
 *
 * @constant
 */

var emptyStats = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, actions.HIT, 0), _defineProperty(_ImmutableMap, actions.MISS, 0), _defineProperty(_ImmutableMap, actions.BUST, 0), _ImmutableMap));
/**
 * Resolve map key from arguments
 *
 * @param {...any} args Input arguments
 * @returns {string[]} Map keys
 */

var getKeys = function getKeys() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return args.length ? [].concat(args, [Value]) : [Value];
};
/**
 * Created a cached/memoized function with stat tracking
 *
 * @param {string} key Key to identify the cache
 * @param {function} fn Function to cache/memoize
 * @param {number} [timeout=null] Time to live for cached value
 * @return {function} Cached/memoized function
 */


var cached = function cached(key, fn) {
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  // delete once all cached calls are keyed
  if (typeof key === 'function') {
    fn = key;
    key = getModule();
  } else {
    key = key && typeof key === 'string' ? getModule() + " #" + key : 'UNKEYED_CACHE';
  }

  var stats = ImmutableMap();
  var cache = ImmutableMap();
  var timeouts = ImmutableMap();
  /**
   * Bust cache and reset stats
   *
   * @returns {void}
   */

  var reset = function reset() {
    cache = ImmutableMap();
    stats = ImmutableMap();
  };
  /**
   * Stat tracker for hits, misses, and busts
   *
   * @param {string} action Stat description
   * @param {...any} args Input arguments
   * @return {void}
   */


  var count = function count(action) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }

    var keys = getKeys.apply(void 0, args);

    if (!stats.hasIn(keys)) {
      stats = stats.setIn(keys, emptyStats);
    }

    stats = stats.updateIn([].concat(_toConsumableArray(keys), [action]), function (counter) {
      return counter + 1;
    });
  };
  /**
   * Clear timeout
   *
   * @param {...any} args Input arguments
   * @return {void}
   */


  var clear = function clear() {
    var keys = getKeys.apply(void 0, arguments);

    if (timeouts.hasIn(keys)) {
      clearTimeout(timeouts.getIn(keys));
      timeouts = timeouts.deleteIn(keys);
    }
  };
  /**
   * Bust cached value
   *
   * @param {...any} args Input arguments
   * @return {void}
   */


  var bust = function bust() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    var keys = getKeys.apply(void 0, args);

    if (cache.hasIn(keys)) {
      count.apply(void 0, [actions.BUST].concat(args));
      cache = cache.deleteIn(keys);
    }
  };
  /**
   * Cached/memoized function
   *
   * @param {...any} args Input arguments
   * @return {any}
   */


  var cachedFunction = function cachedFunction() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }

    if (DISABLE_CACHED) {
      return fn.apply(void 0, args);
    }

    var keys = getKeys.apply(void 0, args);

    if (!cache.hasIn(keys)) {
      count.apply(void 0, [actions.MISS].concat(args));
      cache = cache.setIn(keys, fn.apply(void 0, args));

      if (timeout === 0) {
        bust.apply(void 0, args);
      } else if (timeout !== null) {
        clear.apply(void 0, args);
        timeouts = timeouts.setIn(keys, setTimeout(function () {
          clear.apply(void 0, args);
          bust.apply(void 0, args);
        }, timeout));
      }
    } else {
      count.apply(void 0, [actions.HIT].concat(args));
    }

    return cache.getIn(keys);
  };

  cachedFunction.bust = bust;
  cachedFunction.reset = reset;

  cachedFunction.stats = function () {
    return stats;
  };

  cachedFunction.get = function () {
    return cache;
  }; // TODO: find better way to handle no-arg collisions


  if (isDevelopment()) {
    global.get('cached').add(key, cachedFunction);
  }

  caches.push(cachedFunction);
  return cachedFunction;
};

cached.Value = Value;

cached.enable = function () {
  return DISABLE_CACHED = false;
};

cached.disable = function () {
  return DISABLE_CACHED = true;
};

cached.resetAll = resetAll;

if (isDevelopment()) {
  var cachesDev = ImmutableMap({});
  var debug = {
    add: function add(key, fn) {
      cachesDev = cachesDev.has(key) ? cachesDev.set(key + "_" + cachesDev.count(), fn) : cachesDev.set(key, fn);
    },
    read: function read() {
      return cachesDev.map(function (cachedFn) {
        return cachedFn.get();
      });
    },
    readNonEmpty: function readNonEmpty() {
      return debug.read().filter(function (cache) {
        return !cache.isEmpty();
      });
    }
  };
  global.set('cached', debug);
}

export default cached;