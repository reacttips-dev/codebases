'use es6';

import { Map as ImmutableMap } from 'immutable';
import formatPipelinesWithPermissions from '../formatters/formatPipelinesWithPermissions';
import formatPipelineStagesWithPermissions from '../formatters/formatPipelineStagesWithPermissions';

var formatResponseWithPermissions = function formatResponseWithPermissions(response) {
  return ImmutableMap({
    pipelines: formatPipelinesWithPermissions(response),
    stages: formatPipelineStagesWithPermissions(response)
  });
};

export var createGetAllPipelinesForTypeWithPermissions = function createGetAllPipelinesForTypeWithPermissions(objectTypeId) {
  return function (_ref) {
    var httpClient = _ref.httpClient;
    return function () {
      return httpClient.get("pipelines/v2/pipelines/" + encodeURIComponent(objectTypeId), {
        query: {
          includePermissions: true
        }
      }).then(formatResponseWithPermissions);
    };
  };
};
export var createGetAllDealPipelinesWithPermissions = createGetAllPipelinesForTypeWithPermissions('0-3');
export var createGetAllTicketPipelinesWithPermissions = createGetAllPipelinesForTypeWithPermissions('0-5');