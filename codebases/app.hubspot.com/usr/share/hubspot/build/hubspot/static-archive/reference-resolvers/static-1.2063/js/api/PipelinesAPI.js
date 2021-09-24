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

export var createGetAllPipelines = function createGetAllPipelines(_ref) {
  var httpClient = _ref.httpClient;
  return function () {
    return httpClient.get('deals/v1/pipelines').then(formatResponse);
  };
};
export var getAllPipelines = createGetAllPipelines({
  httpClient: http
});