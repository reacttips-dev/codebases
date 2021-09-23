'use es6';

import { jsx as _jsx } from "react/jsx-runtime";
import * as FlowActionTypes from '../constants/FlowActionTypes';
import * as FlowApi from '../api/FlowApi';
import * as SequenceWorkflowManagementApi from '../api/SequenceWorkflowManagementApi';
import { selectFlowById } from 'SequencesUI/selectors/flowSelectors';
import { sequenceIdSelector } from 'SequencesUI/selectors/sequenceDataSelectors';
import FloatingAlertStore from 'UIComponents/alert/FloatingAlertStore';
import FormattedMessage from 'I18n/components/FormattedMessage';
var _pendingFlowIdsFetch = null;
export var fetchFlowIdsForSequence = function fetchFlowIdsForSequence(sequenceId) {
  return function (dispatch) {
    if (_pendingFlowIdsFetch == null) {
      dispatch({
        type: FlowActionTypes.FLOW_IDS_FETCH_STARTED
      });
      _pendingFlowIdsFetch = SequenceWorkflowManagementApi.fetchFlowIdsForSequence(sequenceId).then(function (response) {
        dispatch({
          type: FlowActionTypes.FLOW_IDS_FETCH_SUCCEEDED,
          payload: response
        });
      }, function (err) {
        dispatch({
          type: FlowActionTypes.FLOW_IDS_FETCH_FAILED
        });
        FloatingAlertStore.addAlert({
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequencesAutomation.alerts.fetchFlow.error.title"
          }),
          message: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequencesAutomation.alerts.fetchFlow.error.message"
          }),
          type: 'danger'
        });
        throw err;
      }).finally(function () {
        _pendingFlowIdsFetch = null;
      });
    }
  };
};
var _pendingFlowsFetch = null;
export var fetchFlows = function fetchFlows(flowIds) {
  return function (dispatch) {
    if (_pendingFlowsFetch == null) {
      dispatch({
        type: FlowActionTypes.FLOWS_FETCH_STARTED
      });
      _pendingFlowsFetch = FlowApi.fetchFlowsByIdBatch(flowIds).then(function (response) {
        dispatch({
          type: FlowActionTypes.FLOWS_FETCH_SUCCEEDED,
          payload: response
        });
      }, function (err) {
        dispatch({
          type: FlowActionTypes.FLOWS_FETCH_FAILED
        });
        FloatingAlertStore.addAlert({
          titleText: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequencesAutomation.alerts.fetchFlow.error.title"
          }),
          message: /*#__PURE__*/_jsx(FormattedMessage, {
            message: "sequencesAutomation.alerts.fetchFlow.error.message"
          }),
          type: 'danger'
        });
        throw err;
      }).finally(function () {
        _pendingFlowsFetch = null;
      });
    }
  };
};
export var createFlow = function createFlow(_ref) {
  var flow = _ref.flow;
  return function (dispatch, getState) {
    var sequenceId = sequenceIdSelector(getState());
    return FlowApi.createFlow({
      flow: flow,
      sequenceId: sequenceId
    }).then(function (_createdFlow) {
      return SequenceWorkflowManagementApi.addFlowIdToSequence({
        flowId: _createdFlow.flowId,
        sequenceId: sequenceId
      }).then(function () {
        return _createdFlow;
      });
    }).then(function (createdFlow) {
      dispatch({
        type: FlowActionTypes.FLOW_CREATE_SUCCEEDED,
        payload: createdFlow
      });
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.success"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.alerts.createFlow.success.message",
          "data-test-id": "create-workflow-success-alert"
        }),
        type: 'success'
      });
    }).catch(function (err) {
      dispatch({
        type: FlowActionTypes.FLOW_CREATE_FAILED
      });
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.alerts.createFlow.error.title"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.alerts.createFlow.error.message"
        }),
        type: 'danger'
      });
      throw err;
    });
  };
};
export var deleteFlow = function deleteFlow(flowId) {
  return function (dispatch, getState) {
    var sequenceId = sequenceIdSelector(getState());
    return FlowApi.deleteFlowById({
      sequenceId: sequenceId,
      flowId: flowId
    }).then(function () {
      return SequenceWorkflowManagementApi.deleteFlowIdFromSequence(flowId);
    }).then(function () {
      dispatch({
        type: FlowActionTypes.FLOW_DELETE_SUCCEEDED,
        payload: flowId
      });
      FloatingAlertStore.addAlert({
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.alerts.deleteFlow.success.message",
          "data-test-id": "delete-workflow-success-alert"
        }),
        type: 'success'
      });
    }).catch(function () {
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.alerts.deleteFlow.error.title"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.alerts.deleteFlow.error.message"
        }),
        type: 'danger'
      });
    });
  };
};
export var updateFlow = function updateFlow(_ref2) {
  var flow = _ref2.flow;
  return function (dispatch) {
    // Call a fn to process it... Maybe have to pass in stagedFilters as a separate argument
    return FlowApi.updateFlow(flow).then(function (response) {
      dispatch({
        type: FlowActionTypes.FLOW_UPDATE_SUCCEEDED,
        payload: response
      });
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequences.alerts.success"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.alerts.updateFlow.success.message",
          "data-test-id": "update-workflow-success-alert"
        }),
        type: 'success'
      });
    }).catch(function (err) {
      FloatingAlertStore.addAlert({
        titleText: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.alerts.updateFlow.error.title"
        }),
        message: /*#__PURE__*/_jsx(FormattedMessage, {
          message: "sequencesAutomation.alerts.updateFlow.error.message"
        }),
        type: 'danger'
      });
      throw err;
    });
  };
};
export var updateFlowEnabled = function updateFlowEnabled(_ref3) {
  var flowId = _ref3.flowId,
      isEnabled = _ref3.isEnabled;
  return function (dispatch, getState) {
    var flow = selectFlowById(flowId)(getState());
    var updatedFlow = Object.assign({}, flow, {
      isEnabled: isEnabled
    });
    return updateFlow({
      flow: updatedFlow
    })(dispatch);
  };
};