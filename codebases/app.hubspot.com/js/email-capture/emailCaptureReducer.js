'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { Map as ImmutableMap } from 'immutable';
import { handleActions } from 'flux-actions';
import * as ActionTypes from '../constants/VisitorActionTypes';
import { CREATE_NEW_THREAD } from '../thread-create/constants/actionTypes';
import { FETCH_THREAD_HISTORY } from '../thread-histories/constants/ActionTypes';
var initialState = ImmutableMap({
  hasVisitorEmail: false
});
var emailCaptureReducer = handleActions((_handleActions = {}, _defineProperty(_handleActions, CREATE_NEW_THREAD.SUCCEEDED, function (state, action) {
  var shouldAskForEmail = action.payload.shouldAskForEmail;
  return state.set('hasVisitorEmail', !shouldAskForEmail);
}), _defineProperty(_handleActions, FETCH_THREAD_HISTORY.SUCCEEDED, function (state, action) {
  var hasVisitorEmail = action.payload.data.hasVisitorEmail;
  return state.set('hasVisitorEmail', hasVisitorEmail);
}), _defineProperty(_handleActions, ActionTypes.SEND_VISITOR_EMAIL_ADDRESS_SUCCEEDED, function (state) {
  return state.set('hasVisitorEmail', true);
}), _handleActions), initialState);
export default emailCaptureReducer;