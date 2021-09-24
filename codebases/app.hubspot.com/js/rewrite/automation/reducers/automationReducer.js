'use es6';

import { PENDING, SUCCEEDED, FAILED } from '../../constants/RequestStatus';
import { FETCH_AUTOMATION_FLOW_STARTED, FETCH_AUTOMATION_FLOW_SUCCEEDED, FETCH_AUTOMATION_FLOW_FAILED } from '../actions/automationActionTypes';
import { produce } from 'immer';
var initialState = {
  status: {},
  data: {}
};
export var automationReducer = produce(function (draft, action) {
  switch (action.type) {
    case FETCH_AUTOMATION_FLOW_STARTED:
      {
        var flowIds = action.payload.flowIds;
        flowIds.forEach(function (flowId) {
          return draft.status[flowId] = PENDING;
        });
        return draft;
      }

    case FETCH_AUTOMATION_FLOW_SUCCEEDED:
      {
        var _action$payload = action.payload,
            _flowIds = _action$payload.flowIds,
            response = _action$payload.response;

        _flowIds.forEach(function (flowId) {
          draft.status[flowId] = SUCCEEDED;
          draft.data[flowId] = response[flowId];
        });

        return draft;
      }

    case FETCH_AUTOMATION_FLOW_FAILED:
      {
        var _flowIds2 = action.payload.flowIds;

        _flowIds2.forEach(function (flowId) {
          return draft.status[flowId] = FAILED;
        });

        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);