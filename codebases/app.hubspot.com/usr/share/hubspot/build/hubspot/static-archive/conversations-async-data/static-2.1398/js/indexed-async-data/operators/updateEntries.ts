import { Iterable } from 'immutable';
import curry from 'transmute/curry';
import invariant from '../../lib/invariant';
import { ENTRIES } from '../constants/keyPaths';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { operatorInvariant } from '../invariants/operatorInvariant';
import { applyIdInvariant } from './applyIdInvariant';
import { applyIdTransform } from './applyIdTransform';
import { getEntry } from './getEntry';
import { applyEvict } from './applyEvict';

/**
 * Update entries in IndexedAsyncData
 *
 * @param {Iterable} ids entry ids to update
 * @param {Function} operator operator to apply to data receives `id` and `data` as arguments
 * @param {IndexedAsyncData} indexedData IndexedAsyncData to update the entry in
 * @returns {IndexedAsyncData}
 */
export var updateEntries = curry(function (ids, operator, indexedData) {
  indexedDataInvariant(indexedData);
  operatorInvariant(operator);
  invariant(Iterable.isIterable(ids), 'Expected ids to be iterable not a `%s`', typeof ids);

  var reducer = function reducer(updatedEntries, id) {
    applyIdInvariant(id, indexedData);
    return updatedEntries.set(applyIdTransform(id, indexedData), operator(id, getEntry(id, indexedData)));
  };

  return applyEvict( // TODO: updateIn types need fixing
  indexedData.updateIn(ENTRIES, function (entries) {
    return ids.reduce(reducer, entries);
  }));
});