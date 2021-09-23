'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { fetchContactByEmailAddress, createFetchContactByEmailAddress } from 'reference-resolvers/api/ContactsAPI';
export var createContactByEmailReferenceResolver = function createContactByEmailReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.CONTACTS_BY_EMAIL,
    createFetchByIds: createFetchContactByEmailAddress,
    fetchByIds: fetchContactByEmailAddress
  }, options));
};
export default createContactByEmailReferenceResolver();