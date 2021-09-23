'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _callDispositions;

import { handleActions } from 'redux-actions';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { CALL_DISPOSITIONS_DATA } from '../actions/asyncActionTypes';
import { List } from 'immutable';
var initialState = AsyncData({
  data: List()
});
var callDispositions = (_callDispositions = {}, _defineProperty(_callDispositions, CALL_DISPOSITIONS_DATA.STARTED, requestStarted), _defineProperty(_callDispositions, CALL_DISPOSITIONS_DATA.SUCCEEDED, function (state, _ref) {
  var payload = _ref.payload;
  return requestSucceededWithOperator(function () {
    return payload.data;
  }, state);
}), _defineProperty(_callDispositions, CALL_DISPOSITIONS_DATA.FAILED, requestFailed), _callDispositions);
export default handleActions(callDispositions, initialState);