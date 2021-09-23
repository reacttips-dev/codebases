'use es6';

import http from 'hub-http/clients/apiClient';
import { createGetAllTicketPipelinesWithPermissions } from '../api/PipelinesWithPermissionsAPI';
import { createTicketPipelinesReferenceResolver } from './TicketPipelinesReferenceResolver';
var getAllTicketPipelines = createGetAllTicketPipelinesWithPermissions({
  httpClient: http
});
export var createTicketPipelinesWithPermissionsReferenceResolver = function createTicketPipelinesWithPermissionsReferenceResolver(options) {
  return createTicketPipelinesReferenceResolver(Object.assign({
    createFetchData: createGetAllTicketPipelinesWithPermissions,
    fetchData: getAllTicketPipelines
  }, options));
};
export default createTicketPipelinesWithPermissionsReferenceResolver();