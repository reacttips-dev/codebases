'use es6';

import { DEAL, TICKET } from 'customer-data-objects/constants/ObjectTypes';
export var getFlowUuid = function getFlowUuid(objectType, pipelineId, stageId) {
  if (!pipelineId || !stageId) {
    return null;
  }

  if (objectType === DEAL) {
    return "deal-" + pipelineId + "-" + stageId;
  }

  if (objectType === TICKET) {
    return "ticket-" + pipelineId + "-" + stageId;
  }

  return null;
};
export var getFlowUuids = function getFlowUuids(objectType, pipelineId, stageIds) {
  var flowUuids = stageIds.map(function (stageId) {
    return getFlowUuid(objectType, pipelineId, stageId);
  });
  return flowUuids.includes(null) ? null : flowUuids;
};