'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions, combineActions } from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { REFRESH_WIDGET_DATA, UPDATE_SESSION_ID } from '../constants/actionTypes';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import WidgetData from 'conversations-internal-schema/widget-data/records/WidgetData';
import { updateAsyncData } from 'conversations-async-data/async-data/operators/updateAsyncData';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { setSessionId } from '../operators/setSessionId';
var initialState = new AsyncData({
  data: new WidgetData()
});
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, ActionTypes.GET_WIDGET_DATA, requestStarted), _defineProperty(_handleActions, combineActions(ActionTypes.GET_WIDGET_DATA_SUCCEEDED, REFRESH_WIDGET_DATA), function (state, action) {
  return requestSucceededWithOperator(function () {
    return action.payload;
  }, state);
}), _defineProperty(_handleActions, UPDATE_SESSION_ID, function (state, action) {
  var sessionId = action.payload.sessionId;
  return updateAsyncData(setSessionId(sessionId), state);
}), _handleActions), initialState);