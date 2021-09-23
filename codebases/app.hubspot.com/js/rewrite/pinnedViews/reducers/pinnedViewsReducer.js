'use es6';

import { produce } from 'immer';
import { FETCH_PINNED_VIEWS_STARTED, FETCH_PINNED_VIEWS_SUCCEEDED, FETCH_PINNED_VIEWS_FAILED, SET_PINNED_VIEWS_SUCCEEDED } from '../actions/pinnedViewsActionTypes';
import { PENDING, SUCCEEDED, FAILED } from '../../constants/RequestStatus';
var initialState = {
  status: {},
  data: {}
};
export var pinnedViewsReducer = produce(function (draft, action) {
  switch (action.type) {
    case FETCH_PINNED_VIEWS_STARTED:
      {
        var objectTypeId = action.payload.objectTypeId;
        draft.status[objectTypeId] = PENDING;
        return draft;
      }

    case FETCH_PINNED_VIEWS_SUCCEEDED:
      {
        var _action$payload = action.payload,
            _objectTypeId = _action$payload.objectTypeId,
            pinnedViews = _action$payload.pinnedViews;
        draft.status[_objectTypeId] = SUCCEEDED;
        draft.data[_objectTypeId] = pinnedViews;
        return draft;
      }

    case FETCH_PINNED_VIEWS_FAILED:
      {
        var _objectTypeId2 = action.payload.objectTypeId;
        draft.status[_objectTypeId2] = FAILED;
        return draft;
      }

    case SET_PINNED_VIEWS_SUCCEEDED:
      {
        var _action$payload2 = action.payload,
            _objectTypeId3 = _action$payload2.objectTypeId,
            ids = _action$payload2.ids;
        draft.data[_objectTypeId3] = ids;
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);