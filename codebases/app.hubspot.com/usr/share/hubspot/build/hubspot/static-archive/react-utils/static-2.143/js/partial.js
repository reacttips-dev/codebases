'use es6';

import { CacheLayer, cacheGet, cachePut } from './internal/layeredCache';
var funcCache;
var prevFunc;
var prevCacheLayer;
export default function partial(func) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (func == null) return func;
  if (args.length === 0) return func; // eslint-disable-next-line no-restricted-globals

  if (!funcCache) funcCache = new WeakMap();
  var cacheLayer;

  if (func === prevFunc) {
    // Optimize for the case where we're called repeatedly with the same func
    cacheLayer = prevCacheLayer;
  } else {
    cacheLayer = funcCache.get(func);

    if (!cacheLayer) {
      cacheLayer = new CacheLayer();
      funcCache.set(func, cacheLayer);
    }
  }

  prevFunc = func;
  prevCacheLayer = cacheLayer;
  var partialFunc = cacheGet(cacheLayer, args);

  if (!partialFunc) {
    partialFunc = function partialFunc() {
      for (var _len2 = arguments.length, partialArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        partialArgs[_key2] = arguments[_key2];
      }

      return func.apply(void 0, args.concat(partialArgs));
    };

    cachePut(cacheLayer, args, partialFunc);
  }

  return partialFunc;
}