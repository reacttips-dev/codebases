'use es6';

import http from 'hub-http/clients/apiClient';
import { createGetAllDealPipelinesWithPermissions } from '../api/PipelinesWithPermissionsAPI';
import { createPipelineStageReferenceResolver } from './PipelineStageReferenceResolver';
var getAllDealPipelines = createGetAllDealPipelinesWithPermissions({
  httpClient: http
});
export var createDealPipelineStagesWithPermissionsReferenceResolver = function createDealPipelineStagesWithPermissionsReferenceResolver(options) {
  return createPipelineStageReferenceResolver(Object.assign({
    createFetchData: createGetAllDealPipelinesWithPermissions,
    fetchData: getAllDealPipelines
  }, options));
};
export default createDealPipelineStagesWithPermissionsReferenceResolver();