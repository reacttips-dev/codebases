'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { FLOW_IDS_FETCH_STARTED, FLOW_IDS_FETCH_SUCCEEDED, FLOW_IDS_FETCH_FAILED, FLOWS_FETCH_STARTED, FLOWS_FETCH_SUCCEEDED, FLOWS_FETCH_FAILED, FLOW_DELETE_SUCCEEDED, FLOW_UPDATE_SUCCEEDED, FLOW_CREATE_SUCCEEDED } from 'SequencesUI/constants/FlowActionTypes';
import { CLEAR_SEQUENCE } from '../constants/SequenceEditorActionTypes';
export default (function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    flows: null,
    flowIds: null
  };
  var action = arguments.length > 1 ? arguments[1] : undefined;

  switch (action.type) {
    case CLEAR_SEQUENCE:
      return {
        flows: null,
        flowIds: null
      };

    case FLOW_IDS_FETCH_STARTED:
      return Object.assign({}, state, {
        flowIds: null
      });

    case FLOW_IDS_FETCH_SUCCEEDED:
      return Object.assign({}, state, {
        flowIds: action.payload
      });

    case FLOW_IDS_FETCH_FAILED:
      return Object.assign({}, state, {
        flowIds: []
      });

    case FLOWS_FETCH_STARTED:
      return Object.assign({}, state, {
        flows: null
      });

    case FLOWS_FETCH_SUCCEEDED:
      return Object.assign({}, state, {
        flows: action.payload
      });

    case FLOWS_FETCH_FAILED:
      return Object.assign({}, state, {
        flows: {}
      });

    case FLOW_DELETE_SUCCEEDED:
      return Object.assign({}, state, {
        flows: Object.assign({}, state.flows, _defineProperty({}, action.payload, undefined))
      });

    case FLOW_CREATE_SUCCEEDED:
      {
        var flow = action.payload;
        return {
          flowIds: [].concat(_toConsumableArray(state.flowIds), [flow.flowId]),
          flows: Object.assign({}, state.flows, _defineProperty({}, flow.flowId, flow))
        };
      }

    case FLOW_UPDATE_SUCCEEDED:
      {
        var _flow = action.payload;
        return Object.assign({}, state, {
          flows: Object.assign({}, state.flows, _defineProperty({}, _flow.flowId, _flow))
        });
      }

    default:
      return state;
  }
});