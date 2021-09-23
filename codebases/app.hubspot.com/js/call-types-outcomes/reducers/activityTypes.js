'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _activityTypes;

import { handleActions } from 'redux-actions';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { ACTIVITY_TYPES_DATA } from '../actions/asyncActionTypes';
import { List } from 'immutable';
var initialState = AsyncData({
  data: List()
});
var activityTypes = (_activityTypes = {}, _defineProperty(_activityTypes, ACTIVITY_TYPES_DATA.STARTED, requestStarted), _defineProperty(_activityTypes, ACTIVITY_TYPES_DATA.SUCCEEDED, function (state, _ref) {
  var payload = _ref.payload;
  return requestSucceededWithOperator(function () {
    return payload.data;
  }, state);
}), _defineProperty(_activityTypes, ACTIVITY_TYPES_DATA.FAILED, requestFailed), _activityTypes);
export default handleActions(activityTypes, initialState);