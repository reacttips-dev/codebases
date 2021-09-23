/**
 *
 * Use in place of PipelineReferenceResolver
 * This resolver requires you to translate pipelines and stages in your app
 *
 */
'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { getAllPipelines, createGetAllPipelines } from 'reference-resolvers/api/PipelinesAPI';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import get from 'transmute/get';
export var createDealPipelinesReferenceResolver = function createDealPipelinesReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.DEAL_PIPELINES,
    createFetchData: createGetAllPipelines,
    fetchData: getAllPipelines,
    selectReferences: function selectReferences(response) {
      return get('pipelines', response);
    }
  }, options));
};
export default createDealPipelinesReferenceResolver();