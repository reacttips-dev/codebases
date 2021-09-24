'use es6';

import { PROPERTIES_FETCH_STARTED, PROPERTIES_FETCH_SUCCEEDED, PROPERTIES_FETCH_FAILED } from '../actions/propertiesActionTypes';
import { PENDING, SUCCEEDED, FAILED } from '../../constants/RequestStatus';
import { produce } from 'immer';
var initialState = {
  status: {},
  data: {}
};
export var propertiesReducer = produce(function (draft, action) {
  switch (action.type) {
    case PROPERTIES_FETCH_STARTED:
      {
        var objectTypeId = action.payload.objectTypeId;
        draft.status[objectTypeId] = PENDING;
        return draft;
      }

    case PROPERTIES_FETCH_SUCCEEDED:
      {
        var _action$payload = action.payload,
            properties = _action$payload.properties,
            _objectTypeId = _action$payload.objectTypeId;
        draft.status[_objectTypeId] = SUCCEEDED;
        draft.data[_objectTypeId] = properties.reduce(function (allProperties, _ref) {
          var property = _ref.property;
          allProperties[property.name] = property;
          return allProperties;
        }, {});
        return draft;
      }

    case PROPERTIES_FETCH_FAILED:
      {
        var _objectTypeId2 = action.payload.objectTypeId;
        draft.status[_objectTypeId2] = FAILED;
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);