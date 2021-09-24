'use es6';

import { OWNERS } from 'reference-resolvers/constants/CacheKeys';
import { getOwnersById, getOwnersSearchPage, createGetOwnersById, createGetOwnersSearchPage } from 'reference-resolvers/api/OwnersAPI';
import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import { validateNumericId } from '../lib/validate';
export var createOwnerPagedReferenceResolver = function createOwnerPagedReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: OWNERS,
    idIsValid: validateNumericId,
    createFetchByIds: createGetOwnersById,
    createFetchSearchPage: createGetOwnersSearchPage,
    fetchByIds: getOwnersById,
    fetchSearchPage: getOwnersSearchPage
  }, options));
};
export default createOwnerPagedReferenceResolver();