'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _recordStateReducer;

import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import { TOGGLE_RECORD, SET_INITIAL_RECORD_STATE, SET_CALL_SID } from '../actions/ActionTypes';
var initialState = fromJS({
  isRecording: false,
  error: null,
  callSid: null
});
var recordStateReducer = (_recordStateReducer = {}, _defineProperty(_recordStateReducer, SET_INITIAL_RECORD_STATE, function (state, _ref) {
  var payload = _ref.payload;
  return state.merge({
    isRecording: payload,
    callSid: null
  });
}), _defineProperty(_recordStateReducer, TOGGLE_RECORD.SUCCEEDED, function (state, _ref2) {
  var payload = _ref2.payload;
  return state.set('isRecording', payload.data.includeRecording);
}), _defineProperty(_recordStateReducer, TOGGLE_RECORD.FAILED, function (state, _ref3) {
  var payload = _ref3.payload;
  return state.set('error', payload.error);
}), _defineProperty(_recordStateReducer, SET_CALL_SID, function (state, _ref4) {
  var payload = _ref4.payload;
  return state.set('callSid', payload);
}), _recordStateReducer);
export default handleActions(recordStateReducer, initialState);