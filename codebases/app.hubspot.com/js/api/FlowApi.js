'use es6';

import http from 'hub-http/clients/apiClient';
import I18n from 'I18n';
var BASE_URL = 'automationplatform/v1'; // TODO EA Change to SEQUENCES when workflows team is ready for it,
// see https://git.hubteam.com/HubSpot/AutomationTeam/issues/2870

var SOURCE_APP = 'WORKFLOWS_APP';
export var fetchFlowsByIdBatch = function fetchFlowsByIdBatch(flowIds) {
  return http.post(BASE_URL + "/hybrid/ids/fetch", {
    data: flowIds
  });
};
export var deleteFlowById = function deleteFlowById(_ref) {
  var flowId = _ref.flowId;
  return http.post(BASE_URL + "/hybrid/batch-delete?sourceapp=" + SOURCE_APP, {
    data: {
      flows: [{
        flowId: flowId,
        flowSource: 'PLATFORM'
      }],
      force: true
    }
  });
};
export var createFlow = function createFlow(_ref2) {
  var flow = _ref2.flow,
      sequenceId = _ref2.sequenceId;
  var uuid = "sequence-" + sequenceId + "-" + Date.now();
  var name = I18n.text('sequencesAutomation.flowNameTemplate', {
    sequenceId: "" + sequenceId,
    datetime: I18n.moment().toString()
  });
  var createdFlow = Object.assign({}, flow, {
    uuid: uuid,
    name: name
  });
  return http.post(BASE_URL + "/hybrid/create?sourceapp=" + SOURCE_APP, {
    data: createdFlow
  });
};
export var updateFlow = function updateFlow(flow) {
  return http.post(BASE_URL + "/hybrid/batch?sourceapp=" + SOURCE_APP, {
    data: flow
  });
};