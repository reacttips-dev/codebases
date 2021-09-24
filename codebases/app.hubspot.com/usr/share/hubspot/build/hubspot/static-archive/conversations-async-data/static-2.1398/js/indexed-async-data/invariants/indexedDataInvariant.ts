import invariant from '../../lib/invariant';
import IndexedAsyncData from '../IndexedAsyncData';
export var indexedDataInvariant = function indexedDataInvariant(indexedData) {
  return invariant(indexedData instanceof IndexedAsyncData, 'Expected indexedData to be a `IndexedAsyncData` not a `%s`', typeof indexedData);
};