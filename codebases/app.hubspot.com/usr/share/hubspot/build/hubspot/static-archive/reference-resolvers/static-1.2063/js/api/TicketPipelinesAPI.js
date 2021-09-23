'use es6';

import http from 'hub-http/clients/apiClient';
import { Map as ImmutableMap } from 'immutable';
import formatPipelines from 'reference-resolvers/formatters/formatPipelines';
import formatPipelineStages from 'reference-resolvers/formatters/formatPipelineStages';

var formatResponse = function formatResponse(response) {
  return ImmutableMap({
    pipelines: formatPipelines(response),
    stages: formatPipelineStages(response)
  });
};

export var createGetAllTicketPipelines = function createGetAllTicketPipelines(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get('pipelines/v2/pipelines/TICKET').then(formatResponse);
  };
};
export var getAllTicketPipelines = createGetAllTicketPipelines({
  httpClient: http
});