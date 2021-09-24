'use es6';

import http from 'hub-http/clients/apiClient';
import { createGetAllDealPipelinesWithPermissions } from '../api/PipelinesWithPermissionsAPI';
import { createDealPipelinesReferenceResolver } from './DealPipelinesReferenceResolver';
var getAllDealPipelines = createGetAllDealPipelinesWithPermissions({
  httpClient: http
});
export var createDealPipelinesWithPermissionsReferenceResolver = function createDealPipelinesWithPermissionsReferenceResolver(options) {
  return createDealPipelinesReferenceResolver(Object.assign({
    createFetchData: createGetAllDealPipelinesWithPermissions,
    fetchData: getAllDealPipelines
  }, options));
};
export default createDealPipelinesWithPermissionsReferenceResolver();