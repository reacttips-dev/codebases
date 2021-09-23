'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _userSettingsReducer;

import { handleActions } from 'redux-actions';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { FETCH_USER_SETTINGS, SAVE_USER_SETTING } from '../actions/asyncActionTypes';
import { Map as ImmutableMap } from 'immutable';
var initialState = AsyncData({
  data: ImmutableMap()
});
var userSettingsReducer = (_userSettingsReducer = {}, _defineProperty(_userSettingsReducer, FETCH_USER_SETTINGS.STARTED, requestStarted), _defineProperty(_userSettingsReducer, FETCH_USER_SETTINGS.SUCCEEDED, function (state, _ref) {
  var payload = _ref.payload;
  return requestSucceededWithOperator(function () {
    return payload.data;
  }, state);
}), _defineProperty(_userSettingsReducer, FETCH_USER_SETTINGS.FAILED, requestFailed), _defineProperty(_userSettingsReducer, SAVE_USER_SETTING.STARTED, requestStarted), _defineProperty(_userSettingsReducer, SAVE_USER_SETTING.SUCCEEDED, function (state, _ref2) {
  var payload = _ref2.payload;
  return state.setIn(['data', payload.data.get('key')], payload.data.get('value'));
}), _defineProperty(_userSettingsReducer, SAVE_USER_SETTING.FAILED, requestFailed), _userSettingsReducer);
export default handleActions(userSettingsReducer, initialState);