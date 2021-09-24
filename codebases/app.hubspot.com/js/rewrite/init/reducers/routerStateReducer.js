'use es6';

import { SYNC_ROUTER_VALUES } from '../actions/initActionTypes';
import { produce } from 'immer';
var initialState = {
  currentObjectTypeId: null
};
export var routerStateReducer = produce(function (draft, action) {
  switch (action.type) {
    case SYNC_ROUTER_VALUES:
      {
        var objectTypeId = action.payload.objectTypeId;
        draft.currentObjectTypeId = objectTypeId;
        return draft;
      }

    default:
      {
        return draft;
      }
  }
}, initialState);