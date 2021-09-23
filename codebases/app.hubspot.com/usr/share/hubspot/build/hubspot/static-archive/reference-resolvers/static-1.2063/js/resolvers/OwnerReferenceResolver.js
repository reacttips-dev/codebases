'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { getAllUsers, createGetAllUsers } from 'reference-resolvers/api/UsersAPI';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import get from 'transmute/get';
export var createOwnerReferenceResolver = function createOwnerReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.OWNERS,
    fetchData: getAllUsers,
    createFetchData: createGetAllUsers,
    selectReferences: get('owners')
  }, options));
};
export default createOwnerReferenceResolver();