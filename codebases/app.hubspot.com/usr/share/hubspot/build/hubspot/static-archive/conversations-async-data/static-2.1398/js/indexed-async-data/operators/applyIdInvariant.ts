import curry from 'transmute/curry';
import { indexedDataInvariant } from '../invariants/indexedDataInvariant';
import { getIdInvariant, getName } from './getters';
/**
 * Validate an id for IndexedAsyncData
 *
 * @param {Any} id an id that passes the id invariant
 * @param {IndexedAsyncData} indexedData IndexedAsyncData to get the entry in
 */

export var applyIdInvariant = curry(function (id, indexedData) {
  indexedDataInvariant(indexedData);
  var idInvariant = getIdInvariant(indexedData);
  var name = getName(indexedData);

  try {
    idInvariant(id);
  } catch (error) {
    error.indexedAsyncDataName = name;
    error.indexedAsyncDataValue = JSON.stringify(id);
    throw error;
  }
});