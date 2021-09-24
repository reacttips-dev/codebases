import curry from 'transmute/curry';
import { ENTRIES } from '../constants/keyPaths';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { operatorInvariant } from '../invariants/operatorInvariant';
import { applyEvict } from './applyEvict';
import { applyIdInvariant } from './applyIdInvariant';
import { applyIdTransform } from './applyIdTransform';
import { getNotSetValue } from './getters';

/**
 * Update an entry in IndexedAsyncData
 *
 * @param {Any} id an id that passes the id invariant
 * @param {Function} operator operator to apply to data receives `asyncData` as argument
 * @param {IndexedAsyncData} indexedData IndexedAsyncData to update the entry in
 * @returns {IndexedAsyncData}
 */
export var updateEntry = curry(function (id, operator, indexedData) {
  indexedDataInvariant(indexedData);
  operatorInvariant(operator);
  applyIdInvariant(id, indexedData);
  var key = applyIdTransform(id, indexedData);

  var updater = function updater(entries) {
    return entries.update(key, getNotSetValue(indexedData), operator);
  }; // TODO: updateIn types need fixing


  return applyEvict(indexedData.updateIn(ENTRIES, updater));
});