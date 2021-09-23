import curry from 'transmute/curry';
import { ENTRIES } from '../constants/keyPaths';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { applyIdTransform } from './applyIdTransform';
import { applyIdInvariant } from './applyIdInvariant';

/**
 * Delete an entry in IndexedAsyncData
 *
 * @param {Any} id an id that passes the id invariant
 * @param {IndexedAsyncData} indexedData IndexedAsyncData to delete the entry in
 * @returns {IndexedAsyncData}
 */
export var deleteEntry = curry(function (id, indexedData) {
  indexedDataInvariant(indexedData);
  applyIdInvariant(id, indexedData);
  var key = applyIdTransform(id, indexedData); // TODO: updateIn types need fixing

  return indexedData.updateIn(ENTRIES, function (entries) {
    return entries.delete(key);
  });
});