'use es6';

import { CONTACT_LISTS } from 'reference-resolvers/constants/CacheKeys';
import { getContactListsByIds, getContactListsSearchPage, createGetContactListsByIds, createGetContactListsSearchPage } from 'reference-resolvers/api/ContactListAPI';
import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
export var createContactListReferenceResolver = function createContactListReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CONTACT_LISTS,
    createFetchByIds: createGetContactListsByIds,
    createFetchSearchPage: createGetContactListsSearchPage,
    fetchByIds: getContactListsByIds,
    fetchSearchPage: getContactListsSearchPage
  }, options));
};
export default createContactListReferenceResolver();