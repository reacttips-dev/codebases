'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import { handleActions, combineActions } from 'redux-actions';
import { CalleesRecord } from 'calling-lifecycle-internal/callees/records/CalleesRecords';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { updateData } from 'conversations-async-data/async-data/operators/setters';
import { ADD_CALLEE, FETCH_CALLEES, CLEAR_CALLEES, REMOVE_CALLEE } from '../constants/calleesActionTypes';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { ADD_PHONE_NUMBER_PROPERTY, REMOVE_PHONE_NUMBER_PROPERTY } from '../../callee-properties/actions/asyncActionTypes';
import { SET_TO_NUMBER_IDENTIFIER } from '../../active-call-settings/actions/ActionTypes';
import { SET_CALLEE_TO_UPDATE } from '../constants/addingPropertyActionTypes';
import { addCallee, deleteCallee } from 'calling-lifecycle-internal/callees/operators/calleesOperators';
var initialState = AsyncData({
  data: new CalleesRecord()
});
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, FETCH_CALLEES.STARTED, requestStarted), _defineProperty(_handleActions, FETCH_CALLEES.FAILED, requestFailed), _defineProperty(_handleActions, FETCH_CALLEES.SUCCEEDED, function (state, _ref) {
  var payload = _ref.payload;
  var updatedState = state.data.mergeDeep(payload.data);
  return requestSucceededWithOperator(function () {
    return updatedState;
  }, state);
}), _defineProperty(_handleActions, CLEAR_CALLEES, function () {
  return initialState;
}), _defineProperty(_handleActions, combineActions(ADD_PHONE_NUMBER_PROPERTY.SUCCEEDED, REMOVE_PHONE_NUMBER_PROPERTY.SUCCEEDED, SET_CALLEE_TO_UPDATE, SET_TO_NUMBER_IDENTIFIER, ADD_CALLEE), function (state, _ref2) {
  var payload = _ref2.payload;
  var callee = payload.callee;

  if (!callee) {
    return state;
  }

  return updateData(function (callees) {
    return addCallee(callee, callees);
  }, state);
}), _defineProperty(_handleActions, REMOVE_CALLEE, function (state, _ref3) {
  var payload = _ref3.payload;
  var associationObjectId = payload.associationObjectId,
      associationObjectTypeId = payload.associationObjectTypeId;
  return updateData(function (callees) {
    return deleteCallee({
      associationObjectId: associationObjectId,
      associationObjectTypeId: associationObjectTypeId
    }, callees);
  }, state);
}), _handleActions), initialState);