import { Set as ImmutableSet } from 'immutable';
import curry from 'transmute/curry';
import { ENTRIES } from '../constants/keyPaths';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { applyIdInvariant } from './applyIdInvariant';
import { applyIdTransform } from './applyIdTransform';
/**
 * Delete a set of entries in IndexedAsyncData
 *
 * @param {Set} ids a set of ids to be removed
 * @param {IndexedAsyncData} indexedData IndexedAsyncData to delete the entry in
 * @returns {IndexedAsyncData}
 */

export var deleteEntries = curry(function () {
  var ids = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ImmutableSet();
  var indexedData = arguments.length > 1 ? arguments[1] : undefined;
  indexedDataInvariant(indexedData);
  if (ids.size === 0) return indexedData;

  var reducer = function reducer(updatedEntries, id) {
    applyIdInvariant(id, indexedData);
    return updatedEntries.delete(applyIdTransform(id, indexedData));
  };

  var updater = function updater(entries) {
    return ids.reduce(reducer, entries);
  }; // TODO: updateIn types need fixing


  return indexedData.updateIn(ENTRIES, updater);
});