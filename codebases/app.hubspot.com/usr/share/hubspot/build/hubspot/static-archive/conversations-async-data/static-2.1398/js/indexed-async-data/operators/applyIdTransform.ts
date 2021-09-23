import curry from 'transmute/curry';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { getIdTransform } from './getters';
/**
 * Transform an id into a key for IndexedAsyncData
 *
 * @param {Any} id an id that passes the id invariant
 * @param {IndexedAsyncData} indexedData IndexedAsyncData to get the entry in
 * @returns {Any} key
 */

export var applyIdTransform = curry(function (id, indexedData) {
  indexedDataInvariant(indexedData);
  var idTransform = getIdTransform(indexedData);
  return idTransform(id);
});