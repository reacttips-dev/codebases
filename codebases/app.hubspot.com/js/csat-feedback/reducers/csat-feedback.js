'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _activityTypes;

import { handleActions } from 'redux-actions';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { SUBMIT_CSAT_FEEDBACK, UPDATED_CSAT_FEEDBACK_RATING } from '../actions/actionTypes';
var initialState = AsyncData({
  data: 0
});
var activityTypes = (_activityTypes = {}, _defineProperty(_activityTypes, SUBMIT_CSAT_FEEDBACK.STARTED, requestStarted), _defineProperty(_activityTypes, SUBMIT_CSAT_FEEDBACK.SUCCEEDED, function () {
  return initialState;
}), _defineProperty(_activityTypes, SUBMIT_CSAT_FEEDBACK.FAILED, function () {
  return initialState;
}), _defineProperty(_activityTypes, UPDATED_CSAT_FEEDBACK_RATING, function (state, _ref) {
  var payload = _ref.payload;
  return state.set('data', payload);
}), _activityTypes);
export default handleActions(activityTypes, initialState);