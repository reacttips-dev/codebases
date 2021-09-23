'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _reducer;

import { Map as ImmutableMap } from 'immutable';
import { handleActions } from 'flux-actions';
import { ADD_TIME_ON_PAGE_TRIGGER, REMOVE_TIME_ON_PAGE_TRIGGER } from '../constants/timeOnPageTriggerActionTypes';
var initialState = ImmutableMap({
  timeoutId: 0
});
var reducer = (_reducer = {}, _defineProperty(_reducer, ADD_TIME_ON_PAGE_TRIGGER, function (state, action) {
  var timeoutId = action.payload.timeoutId;
  return state.set('timeoutId', timeoutId, state);
}), _defineProperty(_reducer, REMOVE_TIME_ON_PAGE_TRIGGER, function (state) {
  return state.set('timeoutId', 0, state);
}), _reducer);
export default handleActions(reducer, initialState);