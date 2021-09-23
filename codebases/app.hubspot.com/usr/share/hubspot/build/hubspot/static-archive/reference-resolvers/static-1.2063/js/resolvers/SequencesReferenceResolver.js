'use es6';

import createBatchedReferenceResolver from 'reference-resolvers/lib/createBatchedReferenceResolver';
import { SEQUENCES } from 'reference-resolvers/constants/CacheKeys';
import { SEQUENCE } from 'reference-resolvers/constants/ReferenceObjectTypes';
import { createFetchCrmObjectsSearchPage, fetchCrmObjectsSearchPage, createFetchCrmObjectsByIds, fetchCrmObjectsByIds } from 'reference-resolvers/api/CrmSearchByUniqueIdApi';
var SEQUENCE_ID_PROPERTY = 'hs_sequence_id';
var SEQUENCE_NAME_PROPERTY = 'hs_sequence_name';
export var createSequencesReferenceResolver = function createSequencesReferenceResolver(options) {
  return createBatchedReferenceResolver(Object.assign({
    cacheKey: SEQUENCES,
    createFetchByIds: function createFetchByIds(opts) {
      return createFetchCrmObjectsByIds(opts)(SEQUENCE, SEQUENCE_ID_PROPERTY, SEQUENCE_NAME_PROPERTY);
    },
    createFetchSearchPage: function createFetchSearchPage(opts) {
      return createFetchCrmObjectsSearchPage(opts)(SEQUENCE, SEQUENCE_ID_PROPERTY, SEQUENCE_NAME_PROPERTY);
    },
    fetchByIds: fetchCrmObjectsByIds(SEQUENCE, SEQUENCE_ID_PROPERTY, SEQUENCE_NAME_PROPERTY),
    fetchSearchPage: fetchCrmObjectsSearchPage(SEQUENCE, SEQUENCE_ID_PROPERTY, SEQUENCE_NAME_PROPERTY)
  }, options));
};
export default createSequencesReferenceResolver();