'use es6';

import { get, post, del, send } from 'crm_data/api/ImmutableAPI';
var URI_FETCH = 'automationplatform/v1/flows';
var QUERY_PARAM = '?sourceapp=DEAL_PIPELINE_SETTINGS';

var createFlowUri = function createFlowUri(pipelineId, stageId) {
  return "deals/v1/pipelines/" + encodeURIComponent(pipelineId) + "/" + encodeURIComponent(stageId) + "/flow" + QUERY_PARAM;
};

export function fetch(uuid) {
  return get(URI_FETCH + "/uuid/" + uuid + QUERY_PARAM);
}
export function fetchByUuids(uuids) {
  return post(URI_FETCH + "/uuids/fetch" + QUERY_PARAM, uuids);
}
export function createFlow(_ref) {
  var flowUuid = _ref.flowUuid,
      pipelineId = _ref.pipelineId,
      stageId = _ref.stageId,
      flowName = _ref.flowName;
  return send({
    headers: {},
    type: 'POST'
  }, createFlowUri(pipelineId, stageId), {
    uuid: flowUuid,
    name: flowName
  });
}
export function deleteFlow(_ref2) {
  var flowId = _ref2.flowId;
  return del(URI_FETCH + "/" + flowId + QUERY_PARAM);
}