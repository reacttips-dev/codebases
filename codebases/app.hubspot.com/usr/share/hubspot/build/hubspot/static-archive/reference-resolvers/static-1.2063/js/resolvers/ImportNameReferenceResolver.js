'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { fetchImportNamesById, createFetchImportNamesById } from 'reference-resolvers/api/ImportsAPI';
export var createImportNameReferenceResolver = function createImportNameReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.IMPORT_NAMES,
    createFetchByIds: createFetchImportNamesById,
    fetchByIds: fetchImportNamesById
  }, options));
};
export default createImportNameReferenceResolver();