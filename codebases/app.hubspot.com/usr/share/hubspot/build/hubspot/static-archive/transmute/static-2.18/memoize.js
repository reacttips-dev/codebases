'use es6';

import _enforceFunction from './internal/_enforceFunction';
import { Map, Seq } from 'immutable';

function defaultHashFunction() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  if (args.length === 1) {
    return args[0];
  }

  return Seq(args);
}

function memoized1(cache, operation, hashFunction) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
    args[_key2 - 3] = arguments[_key2];
  }

  var key = hashFunction.apply(void 0, args);

  if (!cache.has(key)) {
    cache.set(key, operation.apply(void 0, args));
  }

  return cache.get(key);
}

function memoizedN(cache, operation, hashFunction) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 3 ? _len3 - 3 : 0), _key3 = 3; _key3 < _len3; _key3++) {
    args[_key3 - 3] = arguments[_key3];
  }

  var key = hashFunction.apply(void 0, args);

  if (!cache.has(key)) {
    cache.set(key, operation.apply(void 0, args));
  }

  return cache.get(key);
}
/**
 * Memoizer that uses a `Map` to allow for arbitrarily many/complex keys.
 *
 * @example
 * const sum = memoize((list) => {
 *   return list.reduce((total, n) => total + n, 0);
 * });
 * // does work and returns 15
 * sum(List.of(1, 2, 3, 4, 5))
 * // returns 15 but does no work
 * sum(List.of(1, 2, 3, 4, 5))
 *
 * @example <caption>We can use the `hashFunction` param to customize the key used in the cache.</caption>
 * const sum = memoize(
 *   (list) => list.reduce((total, n) => total + n, 0),
 *   (list) => return list.join('-')
 * );
 *
 * @example <caption>It's also possible to inspect the state of an instance by reading the `.cache` property.</caption>
 *
 * const sum = memoize(...);
 * Map.isMap(sum.cache) === true;
 *
 * @param  {Function}  operation to memoize.
 * @param  {Function}  hashFunction that generates the cache key.
 * @return {Function}  memoized version of `operation`.
 */


export default function memoize(operation) {
  var hashFunction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultHashFunction;

  _enforceFunction(operation);

  var cache = Map().asMutable();
  var memoizer = operation.length === 1 ? memoized1 : memoizedN;
  var result = memoizer.bind(null, cache, operation, hashFunction);
  result.cache = cache;
  return result;
}