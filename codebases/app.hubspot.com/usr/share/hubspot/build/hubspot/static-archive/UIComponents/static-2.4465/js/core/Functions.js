'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
export function callIfPossible(prop) {
  if (typeof prop !== 'function') {
    return prop;
  }

  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return prop.apply(void 0, args);
}
/**
 * Combines multiple event handlers into a single function.
 *
 * @example
 *  onClick={sequence(this.handleClick, onClick)}
 * @param  {...Function} handlers One or more event handlers to fire from the returned function
 * @returns {Function}
 */

export function sequence() {
  for (var _len2 = arguments.length, handlers = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    handlers[_key2] = arguments[_key2];
  }

  return function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    handlers.forEach(function (handler) {
      return typeof handler === 'function' && handler.apply(void 0, args);
    });
  };
}
var sequenceCache;
var resultKey = {};
/**
 * Combines multiple event handlers into a single function. Unlike `sequence`, `memoizedSequence`
 * uses a cache to ensure that the same function instance is returned every time that you call it
 * with the same arguments, preventing unnecessary React updates.
 *
 * @example
 *  onClick={memoizedSequence(this.handleClick, onClick)}
 * @param  {...Function} handlers One or more event handlers to fire from the returned function
 * @returns {Function}
 */

export function memoizedSequence() {
  for (var _len4 = arguments.length, handlers = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    handlers[_key4] = arguments[_key4];
  }

  var validHandlers = handlers.filter(function (handler) {
    return typeof handler === 'function';
  });
  if (validHandlers.length === 0) return undefined;
  if (validHandlers.length === 1) return validHandlers[0]; // If this sequence has been generated before, return it

  var cache = sequenceCache;
  validHandlers.forEach(function (handler) {
    cache = cache && cache.get(handler);
  });
  if (cache instanceof WeakMap && cache.has(resultKey)) return cache.get(resultKey); // Otherwise, generate a new sequence and save it in the cache

  var newSequence = sequence.apply(void 0, _toConsumableArray(validHandlers));
  if (sequenceCache === undefined) sequenceCache = new WeakMap();
  cache = sequenceCache;
  validHandlers.forEach(function (handler) {
    if (!(cache.get(handler) instanceof WeakMap)) {
      cache.set(handler, new WeakMap());
    }

    cache = cache.get(handler);
  });
  cache.set(resultKey, newSequence);
  return newSequence;
}
var wrapRefObjectCache;

var makeCallbackForRefObject = function makeCallbackForRefObject(ref) {
  return function (el) {
    ref.current = el;
  };
};
/**
 * Returns a callback wrapper around the given ref object.
 * @param {Object} ref
 */


export function wrapRefObject(ref) {
  if (ref == null) return ref;
  if (wrapRefObjectCache === undefined) wrapRefObjectCache = new WeakMap();
  if (wrapRefObjectCache.has(ref)) return wrapRefObjectCache.get(ref);
  var callback = makeCallbackForRefObject(ref);
  wrapRefObjectCache.set(ref, callback);
  return callback;
}