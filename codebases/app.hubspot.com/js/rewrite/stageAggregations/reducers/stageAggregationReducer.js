'use es6';

import { produce } from 'immer';
import { FETCH_STAGE_AGGREGATION_STARTED, FETCH_STAGE_AGGREGATION_SUCCEEDED } from '../actions/stageAggregationActionTypes';
import { SYNC_ROUTER_VALUES } from '../../init/actions/initActionTypes';
import { PENDING, SUCCEEDED } from '../../constants/RequestStatus';
var initialState = {
  status: {},
  data: {}
};
export var stageAggregationReducer = produce(function (draft, action) {
  switch (action.type) {
    case FETCH_STAGE_AGGREGATION_STARTED:
      {
        var stageId = action.payload.stageId;
        draft.status[stageId] = PENDING;
        return draft;
      }

    case FETCH_STAGE_AGGREGATION_SUCCEEDED:
      {
        var _action$payload = action.payload,
            _stageId = _action$payload.stageId,
            data = _action$payload.data;
        draft.status[_stageId] = SUCCEEDED;
        draft.data[_stageId] = data;
        return draft;
      }

    case SYNC_ROUTER_VALUES:
      {
        draft = initialState;
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);