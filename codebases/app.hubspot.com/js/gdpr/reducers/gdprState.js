'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { handleActions } from 'redux-actions';
import { Map as ImmutableMap } from 'immutable';
import { BYPASS_GDPR } from '../actions/ActionTypes';
var initialState = ImmutableMap({});

var bypassGDPRReducer = _defineProperty({}, BYPASS_GDPR, function (state, _ref) {
  var payload = _ref.payload;
  return state.set(payload, true);
});

export default handleActions(bypassGDPRReducer, initialState);