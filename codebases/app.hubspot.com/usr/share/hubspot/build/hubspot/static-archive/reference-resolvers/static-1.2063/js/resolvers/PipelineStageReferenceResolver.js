'use es6';

import * as CacheKeys from 'reference-resolvers/constants/CacheKeys';
import { getAllPipelines, createGetAllPipelines } from 'reference-resolvers/api/PipelinesAPI';
import createSimpleCachedReferenceResolver from 'reference-resolvers/lib/createSimpleCachedReferenceResolver';
import get from 'transmute/get';
import { propertyLabelTranslator } from 'property-translator/propertyTranslator';
/**
 * @deprecated Translation of values in a data fetching library is bad practice
 *
 * Due to some expectations set by other apps, we have to show translated
 * values for deal stages. However, running translations on plain english
 * strings and translating data inside of a data resolver are both bad
 * practices that we should avoid. Please do not copy this pattern to other
 * resolvers.
 */

export var createPipelineStageReferenceResolver = function createPipelineStageReferenceResolver(options) {
  return createSimpleCachedReferenceResolver(Object.assign({
    cacheKey: CacheKeys.DEAL_PIPELINE_STAGES,
    createFetchData: createGetAllPipelines,
    fetchData: getAllPipelines,
    selectReferences: function selectReferences(pipeline) {
      return get('stages', pipeline).map(function (stage) {
        return stage.set('label', propertyLabelTranslator(stage.get('label')));
      });
    }
  }, options));
};
export default createPipelineStageReferenceResolver();