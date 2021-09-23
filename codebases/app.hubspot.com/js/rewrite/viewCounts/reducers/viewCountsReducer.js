'use es6';

import { produce } from 'immer';
import { FAILED, PENDING, SUCCEEDED, UNINITIALIZED } from '../../constants/RequestStatus';
import { mutableUpdateIn } from '../../objectUtils/mutableUpdateIn';
import { CREATE_VIEW_SUCCEEDED, DELETE_VIEW_SUCCEEDED } from '../../views/actions/viewsActionTypes';
import { VIEW_COUNTS_FETCH_FAILED, VIEW_COUNTS_FETCH_STARTED, VIEW_COUNTS_FETCH_SUCCEEDED } from '../actions/viewCountsActionTypes';
var initialState = {
  status: UNINITIALIZED,
  data: null,
  deltas: {}
};
export var viewCountsReducer = produce(function (draft, action) {
  switch (action.type) {
    case VIEW_COUNTS_FETCH_STARTED:
      {
        draft.status = PENDING;
        return draft;
      }

    case VIEW_COUNTS_FETCH_SUCCEEDED:
      {
        var data = action.payload.data;
        draft.status = SUCCEEDED;
        draft.data = data;
        return draft;
      }

    case VIEW_COUNTS_FETCH_FAILED:
      {
        draft.status = FAILED;
        return draft;
      }

    case CREATE_VIEW_SUCCEEDED:
      {
        var objectTypeId = action.payload.objectTypeId;
        mutableUpdateIn(['deltas', objectTypeId], function () {
          var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          return delta + 1;
        }, draft);
        return draft;
      }

    case DELETE_VIEW_SUCCEEDED:
      {
        var _objectTypeId = action.payload.objectTypeId;
        mutableUpdateIn(['deltas', _objectTypeId], function () {
          var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          return delta - 1;
        }, draft);
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);