'use es6';

import { USERS } from 'reference-resolvers/constants/CacheKeys';
import { createFetchUsersSearchPage, createGetUsersByIds, getUsersByIds, getUsersSearchPage } from 'reference-resolvers/api/UsersAPI';
import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import { validateNumericId } from '../lib/validate';
export var createUserReferenceResolver = function createUserReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: USERS,
    idIsValid: validateNumericId,
    createFetchSearchPage: createFetchUsersSearchPage,
    createFetchByIds: createGetUsersByIds,
    fetchByIds: getUsersByIds,
    fetchSearchPage: getUsersSearchPage
  }, options));
};
export default createUserReferenceResolver();