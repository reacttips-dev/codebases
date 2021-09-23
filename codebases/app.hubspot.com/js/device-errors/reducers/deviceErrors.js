'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _deviceErrorReducer;

import { handleActions } from 'redux-actions';
import { Map as ImmutableMap } from 'immutable';
import { SET_DEVICE_ERROR } from '../actions/ActionTypes';
import { RESET_CALL_DATA } from '../../active-call-settings/actions/ActionTypes';
var initialState = ImmutableMap({
  error: null
});
var deviceErrorReducer = (_deviceErrorReducer = {}, _defineProperty(_deviceErrorReducer, SET_DEVICE_ERROR, function (state, _ref) {
  var payload = _ref.payload;
  return state.set('error', payload);
}), _defineProperty(_deviceErrorReducer, RESET_CALL_DATA, function (state) {
  return state.set('error', null);
}), _deviceErrorReducer);
export default handleActions(deviceErrorReducer, initialState);