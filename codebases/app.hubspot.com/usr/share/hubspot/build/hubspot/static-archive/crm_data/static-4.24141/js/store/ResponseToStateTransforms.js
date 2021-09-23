'use es6';

import curry from 'transmute/curry';
import reduce from 'transmute/reduce';
/**
 * Given `getKey` and `getValue`, reduces a Map of "objects" into store state.
 *
 * @param  {(object: T) => K} getKey given an object returns its key in store state
 * @param  {(object: T) => V} getValue given an object returns its value in store state
 * @param  {Map<K, V>} state
 * @param  {Iterable<T>} data
 * @return {Map<K, V>}
 */

export var reduceIntoState = curry(function (getKey, getValue, state, data) {
  if (!data) {
    return state;
  }

  return reduce(state, function (acc, subject, key) {
    if (!subject) {
      return acc;
    }

    return acc.set(getKey(subject, key), getValue(subject, key));
  }, data);
});
/**
 * Merges the `objects` from a payload of `PaginatedSearchResponse`s into store
 * state according to `reducer`.
 *
 * @param  {(state: Map<K, V>, data: Iterable<PaginatedSearchResponse>) => Map<K, V>} reduceObjectsIntoState
 * @param  {Map<K, V>} state
 * @param  {Iterable<PaginatedSearchResponse>}
 * @return {Map<K, V>}
 */

export var reduceSearchResponseIntoState = curry(function (reduceObjectsIntoState, state, data) {
  return reduce(state, function (acc, response) {
    if (!response) {
      return acc;
    }

    return reduceObjectsIntoState(acc, response.objects);
  }, data);
});