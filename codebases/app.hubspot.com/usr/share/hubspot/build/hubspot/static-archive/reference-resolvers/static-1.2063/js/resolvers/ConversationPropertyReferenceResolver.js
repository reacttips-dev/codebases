'use es6';

import { CONVERSATION_PROPERTIES } from 'reference-resolvers/constants/CacheKeys';
import { getConversationProperties, createGetConversationProperties } from 'reference-resolvers/api/PropertiesAPI';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
export var createConversationPropertyReferenceResolver = function createConversationPropertyReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CONVERSATION_PROPERTIES,
    createFetchData: createGetConversationProperties,
    fetchData: getConversationProperties
  }, options));
};
export default createConversationPropertyReferenceResolver();