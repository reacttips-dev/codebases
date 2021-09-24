import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable';
import curry from 'transmute/curry';
import getIn from 'transmute/getIn';
import { ENTRIES, EVICT, ID_INVARIANT, ID_TRANSFORM, NAME, NOT_SET_VALUE } from '../constants/keyPaths';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { applyIdTransform } from './applyIdTransform';
import { applyIdInvariant } from './applyIdInvariant';
export var getEvict = function getEvict(indexedAsyncData) {
  return getIn(EVICT)(indexedAsyncData);
};
export var getIdInvariant = function getIdInvariant(indexedAsyncData) {
  return getIn(ID_INVARIANT)(indexedAsyncData);
};
export var getIdTransform = function getIdTransform(indexedAsyncData) {
  return getIn(ID_TRANSFORM)(indexedAsyncData);
};
export var getName = function getName(indexedAsyncData) {
  return getIn(NAME)(indexedAsyncData);
};
export var getNotSetValue = function getNotSetValue(indexedAsyncData) {
  return getIn(NOT_SET_VALUE)(indexedAsyncData);
};

/**
 * @description Get a single entry out of an indexed async data by id.
 * @param id an id of the type indexedData is indexed by
 * @param {IndexedAsyncData} indexedData
 */
export var getEntry = curry(function (id, indexedData) {
  indexedDataInvariant(indexedData);
  applyIdInvariant(id, indexedData);
  var key = applyIdTransform(id, indexedData);
  var entries = indexedData.getIn(ENTRIES);
  return entries.get(key, getNotSetValue(indexedData));
});
/**
 * @description Get multiple entries out of an IndexedAsyncData
 * record using an optional set of ids
 * @param {Set<Any>} ids a set of ids that pass the idInvariant
 * @param {IndexedAsyncData} indexedData
 */

export var getEntries = function getEntries(indexedData) {
  var ids = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ImmutableSet();
  indexedDataInvariant(indexedData);
  if (!ids.size) return indexedData.getIn(ENTRIES);
  return ids.reduce(function (accumulator, id) {
    applyIdInvariant(id, indexedData);
    var key = applyIdTransform(id, indexedData);
    var entries = indexedData.getIn(ENTRIES);
    var asyncData = entries.get(key, getNotSetValue(indexedData));
    return accumulator.set(key, asyncData);
  }, ImmutableMap());
};