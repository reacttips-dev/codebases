'use es6';

import { produce } from 'immer';
import { PIPELINE_CHANGED } from '../actions/currentPipelineIdActionTypes';
var initialState = {};
export var currentPipelineIdReducer = produce(function (draft, action) {
  switch (action.type) {
    case PIPELINE_CHANGED:
      {
        var _action$payload = action.payload,
            objectTypeId = _action$payload.objectTypeId,
            pipelineId = _action$payload.pipelineId;
        draft[objectTypeId] = pipelineId;
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);