'use es6';

import { FAILED, PENDING, SUCCEEDED, UNINITIALIZED } from '../../constants/RequestStatus';
import { produce } from 'immer';
import { FETCH_DOUBLE_OPT_IN_FAILED, FETCH_DOUBLE_OPT_IN_STARTED, FETCH_DOUBLE_OPT_IN_SUCCEEDED } from '../actions/doubleOptInActionTypes';
var initialState = {
  status: UNINITIALIZED,
  data: null
};
export var doubleOptInReducer = produce(function (draft, action) {
  switch (action.type) {
    case FETCH_DOUBLE_OPT_IN_STARTED:
      {
        draft.status = PENDING;
        return draft;
      }

    case FETCH_DOUBLE_OPT_IN_SUCCEEDED:
      {
        var data = action.payload.data;
        draft.status = SUCCEEDED;
        draft.data = data;
        return draft;
      }

    case FETCH_DOUBLE_OPT_IN_FAILED:
      {
        draft.status = FAILED;
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);