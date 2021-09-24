'use es6';

import { produce } from 'immer';
import { FAILED, PENDING, SUCCEEDED } from '../../constants/RequestStatus';
import { RECENTLY_USED_PROPERTIES_LOAD_FAILED, RECENTLY_USED_PROPERTIES_LOAD_STARTED, RECENTLY_USED_PROPERTIES_LOAD_SUCCEEDED, RECENTLY_USED_PROPERTIES_SET_SUCCEEDED } from '../actions/recentlyUsedPropertiesActionTypes';
var initialState = {
  status: {},
  data: {}
};
export var recentlyUsedPropertiesReducer = produce(function (draft, action) {
  switch (action.type) {
    case RECENTLY_USED_PROPERTIES_LOAD_STARTED:
      {
        var objectTypeId = action.payload.objectTypeId;
        draft.status[objectTypeId] = PENDING;
        return draft;
      }

    case RECENTLY_USED_PROPERTIES_LOAD_SUCCEEDED:
      {
        var _action$payload = action.payload,
            _objectTypeId = _action$payload.objectTypeId,
            value = _action$payload.value;
        draft.status[_objectTypeId] = SUCCEEDED;
        draft.data[_objectTypeId] = value;
        return draft;
      }

    case RECENTLY_USED_PROPERTIES_LOAD_FAILED:
      {
        var _objectTypeId2 = action.payload.objectTypeId;
        draft.status[_objectTypeId2] = FAILED;
        return draft;
      }

    case RECENTLY_USED_PROPERTIES_SET_SUCCEEDED:
      {
        var _action$payload2 = action.payload,
            _objectTypeId3 = _action$payload2.objectTypeId,
            _value = _action$payload2.value;
        draft.data[_objectTypeId3] = _value;
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);