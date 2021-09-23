'use es6';

import { get, post, send } from 'crm_data/api/ImmutableAPI';
var URI_FETCH = 'automationplatform/v1/flows';
var QUERY_PARAM = '?sourceapp=TICKET_PIPELINE_SETTINGS';
var URI_CREATE_FLOW = 'services/v1/flows/stage-flow';
export function fetch(uuid) {
  return get(URI_FETCH + "/uuid/" + uuid + QUERY_PARAM);
}
export function fetchByUuids(uuids) {
  return post(URI_FETCH + "/uuids/fetch" + QUERY_PARAM, uuids);
}
export function createFlow(_ref) {
  var stageId = _ref.stageId,
      flowUuid = _ref.flowUuid,
      flowName = _ref.flowName;
  return send({
    headers: {},
    type: 'POST'
  }, URI_CREATE_FLOW, {
    stages: [stageId],
    flowUuid: flowUuid,
    flowName: flowName
  });
}