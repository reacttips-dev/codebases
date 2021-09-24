'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import { TEMPLATES } from 'reference-resolvers/constants/CacheKeys';
import { TEMPLATE } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { createFetchCrmObjectsSearchPage, fetchCrmObjectsSearchPage, createFetchCrmObjectsByIds, fetchCrmObjectsByIds } from 'reference-resolvers/api/CrmSearchByUniqueIdApi';
var TEMPLATE_ID_PROPERTY = 'hs_template_id';
var TEMPLATE_NAME_PROPERTY = 'hs_template_name';
export var createTemplatesReferenceResolver = function createTemplatesReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: TEMPLATES,
    createFetchByIds: function createFetchByIds(opts) {
      return createFetchCrmObjectsByIds(opts)(TEMPLATE, TEMPLATE_ID_PROPERTY, TEMPLATE_NAME_PROPERTY);
    },
    createFetchSearchPage: function createFetchSearchPage(opts) {
      return createFetchCrmObjectsSearchPage(opts)(TEMPLATE, TEMPLATE_ID_PROPERTY, TEMPLATE_NAME_PROPERTY);
    },
    fetchByIds: fetchCrmObjectsByIds(TEMPLATE, TEMPLATE_ID_PROPERTY, TEMPLATE_NAME_PROPERTY),
    fetchSearchPage: fetchCrmObjectsSearchPage(TEMPLATE, TEMPLATE_ID_PROPERTY, TEMPLATE_NAME_PROPERTY)
  }, options));
};
export default createTemplatesReferenceResolver();