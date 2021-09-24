'use es6';

import http from 'hub-http/clients/apiClient';
export var fetchFlowIdsForSequence = function fetchFlowIdsForSequence(sequenceId) {
  return http.get("sequences/v2/embedded-workflows/sequence/" + sequenceId + "/active").then(function (response) {
    return response.results.map(function (r) {
      return r.workflowId;
    });
  });
};
export var fetchFlowIdsForSequenceIncludingDeleted = function fetchFlowIdsForSequenceIncludingDeleted(_ref) {
  var sequenceId = _ref.sequenceId;
  return http.get("sequences/v2/embedded-workflows/sequence/" + sequenceId + "/all").then(function (response) {
    return response.results.map(function (r) {
      return r.workflowId;
    });
  });
};
export var deleteFlowIdFromSequence = function deleteFlowIdFromSequence(flowId) {
  return http.delete("sequences/v2/embedded-workflows/workflow/" + flowId);
};
export var addFlowIdToSequence = function addFlowIdToSequence(_ref2) {
  var flowId = _ref2.flowId,
      sequenceId = _ref2.sequenceId;
  return http.post("sequences/v2/embedded-workflows/sequence/" + sequenceId, {
    data: {
      workflowId: flowId
    }
  });
};
export var fetchEnrollActionOptionsSender = function fetchEnrollActionOptionsSender() {
  return http.get('sequences/v2/workflows/senders');
};
export var fetchEnrollActionOptionsEmailAddress = function fetchEnrollActionOptionsEmailAddress(_ref3) {
  var senderUserId = _ref3.senderUserId;

  if (!senderUserId) {
    return Promise.resolve({
      options: []
    });
  }

  return http.get("sequences/v2/workflows/senders/connected-inboxes/" + senderUserId);
};