'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { CONTACT } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { createSearchObjects, searchObjects } from 'reference-resolvers/api/ContactSearchAPI';
import { createFetchByIds, fetchByIds } from 'reference-resolvers/api/ContactsV3API';
export var createContactReferenceResolver = function createContactReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.CONTACTS,
    createFetchByIds: createFetchByIds,
    createFetchSearchPage: function createFetchSearchPage(opts) {
      return createSearchObjects(opts)(CONTACT);
    },
    fetchByIds: fetchByIds,
    fetchSearchPage: searchObjects(CONTACT)
  }, options));
};
export default createContactReferenceResolver();