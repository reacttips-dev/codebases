'use es6';

import { produce } from 'immer';
import { FAILED, PENDING, SUCCEEDED } from '../../constants/RequestStatus';
import { mutableSetIn } from '../../objectUtils/mutableSetIn';
import { RECORD_CARD_FETCH_FAILED, RECORD_CARD_FETCH_STARTED, RECORD_CARD_FETCH_SUCCEEDED } from '../actions/recordCardsActionTypes';
var initialState = {
  status: {},
  data: {}
};
export var recordCardsReducer = produce(function (draft, action) {
  switch (action.type) {
    case RECORD_CARD_FETCH_STARTED:
      {
        var _action$payload = action.payload,
            location = _action$payload.location,
            objectTypeId = _action$payload.objectTypeId;
        mutableSetIn(['status', objectTypeId, location], PENDING, draft);
        return draft;
      }

    case RECORD_CARD_FETCH_SUCCEEDED:
      {
        var _action$payload2 = action.payload,
            _location = _action$payload2.location,
            _objectTypeId = _action$payload2.objectTypeId,
            data = _action$payload2.data;
        mutableSetIn(['status', _objectTypeId, _location], SUCCEEDED, draft);
        mutableSetIn(['data', _objectTypeId, _location], data, draft);
        return draft;
      }

    case RECORD_CARD_FETCH_FAILED:
      {
        var _action$payload3 = action.payload,
            _location2 = _action$payload3.location,
            _objectTypeId2 = _action$payload3.objectTypeId;
        mutableSetIn(['status', _objectTypeId2, _location2], FAILED, draft);
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);