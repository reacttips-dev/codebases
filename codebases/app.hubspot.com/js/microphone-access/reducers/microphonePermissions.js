'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _microphonePermission;

import { handleActions } from 'redux-actions';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { MICROPHONE_PERMISSIONS, MICROPHONE_ACCESS } from '../actions/asyncActionTypes';
var initialState = AsyncData({
  data: 'prompt'
});
var microphonePermissions = (_microphonePermission = {}, _defineProperty(_microphonePermission, MICROPHONE_PERMISSIONS.STARTED, requestStarted), _defineProperty(_microphonePermission, MICROPHONE_PERMISSIONS.SUCCEEDED, function (state, _ref) {
  var payload = _ref.payload;
  return requestSucceededWithOperator(function () {
    return payload.data;
  }, state);
}), _defineProperty(_microphonePermission, MICROPHONE_PERMISSIONS.FAILED, requestFailed), _defineProperty(_microphonePermission, MICROPHONE_ACCESS.STARTED, requestStarted), _defineProperty(_microphonePermission, MICROPHONE_ACCESS.SUCCEEDED, function (state) {
  return requestSucceededWithOperator(function () {
    return 'granted';
  }, state);
}), _defineProperty(_microphonePermission, MICROPHONE_ACCESS.FAILED, requestFailed), _microphonePermission);
export default handleActions(microphonePermissions, initialState);