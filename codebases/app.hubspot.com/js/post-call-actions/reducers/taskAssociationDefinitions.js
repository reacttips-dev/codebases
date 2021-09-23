'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _taskAssociationDefin;

import { handleActions } from 'redux-actions';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { FETCH_TASK_ASSOCIATION_DEFINITIONS } from '../actions/taskAssociationDefinitionsActionTypes';
import { List } from 'immutable';
var initialState = AsyncData({
  data: List()
});
var taskAssociationDefinitions = (_taskAssociationDefin = {}, _defineProperty(_taskAssociationDefin, FETCH_TASK_ASSOCIATION_DEFINITIONS.STARTED, requestStarted), _defineProperty(_taskAssociationDefin, FETCH_TASK_ASSOCIATION_DEFINITIONS.SUCCEEDED, function (state, _ref) {
  var payload = _ref.payload;
  return requestSucceededWithOperator(function () {
    return payload.data;
  }, state);
}), _defineProperty(_taskAssociationDefin, FETCH_TASK_ASSOCIATION_DEFINITIONS.FAILED, requestFailed), _taskAssociationDefin);
export default handleActions(taskAssociationDefinitions, initialState);