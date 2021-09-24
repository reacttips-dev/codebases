'use es6';

import { CONTACT_STATIC_LISTS } from 'reference-resolvers/constants/CacheKeys';
import { getContactListsByIds, getStaticContactListsSearchPage, createGetContactListsByIds, createGetStaticContactListsSearchPage } from 'reference-resolvers/api/ContactListAPI';
import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
export var createContactStaticListReferenceResolver = function createContactStaticListReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CONTACT_STATIC_LISTS,
    createFetchByIds: createGetContactListsByIds,
    createFetchSearchPage: createGetStaticContactListsSearchPage,
    fetchByIds: getContactListsByIds,
    fetchSearchPage: getStaticContactListsSearchPage
  }, options));
};
export default createContactStaticListReferenceResolver();