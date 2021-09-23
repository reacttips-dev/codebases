'use es6';

import http from 'hub-http/clients/apiClient';
import { createGetAllTicketPipelinesWithPermissions } from '../api/PipelinesWithPermissionsAPI';
import { createTicketStagesReferenceResolver } from './TicketStagesReferenceResolver';
var getAllTicketPipelines = createGetAllTicketPipelinesWithPermissions({
  httpClient: http
});
export var createTicketPipelineStagesWithPermissionsReferenceResolver = function createTicketPipelineStagesWithPermissionsReferenceResolver(options) {
  return createTicketStagesReferenceResolver(Object.assign({
    createFetchData: createGetAllTicketPipelinesWithPermissions,
    fetchData: getAllTicketPipelines
  }, options));
};
export default createTicketPipelineStagesWithPermissionsReferenceResolver();