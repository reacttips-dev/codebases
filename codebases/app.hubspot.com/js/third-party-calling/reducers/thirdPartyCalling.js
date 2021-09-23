'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _thirdPartyCalling;

import { handleActions } from 'redux-actions';
import ThirdPartyCalling from '../records/ThirdPartyCalling';
import { THIRD_PARTY_STATUS_CHANGE, THIRD_PARTY_LOG_IN, THIRD_PARTY_LOG_OUT } from '../constants/ThirdPartyCallingActionTypes';
import { SET_SELECTED_CALL_PROVIDER } from '../../calling-providers/actions/ActionTypes';
import { READY } from '../constants/ThirdPartyStatus';
var initialState = new ThirdPartyCalling();
var thirdPartyCalling = (_thirdPartyCalling = {}, _defineProperty(_thirdPartyCalling, THIRD_PARTY_STATUS_CHANGE, function (state, _ref) {
  var status = _ref.payload.status;
  return state.set('status', status);
}), _defineProperty(_thirdPartyCalling, THIRD_PARTY_LOG_IN, function (state) {
  return state.merge({
    status: READY,
    isLoggedIn: true
  });
}), _defineProperty(_thirdPartyCalling, THIRD_PARTY_LOG_OUT, function (state) {
  return state.merge({
    isLoggedIn: false
  });
}), _defineProperty(_thirdPartyCalling, SET_SELECTED_CALL_PROVIDER, function () {
  return new ThirdPartyCalling();
}), _thirdPartyCalling);
export default handleActions(thirdPartyCalling, initialState);