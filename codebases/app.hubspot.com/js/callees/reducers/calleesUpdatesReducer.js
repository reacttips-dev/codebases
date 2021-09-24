'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _calleesUpdates;

import { handleActions } from 'redux-actions';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { ADD_PHONE_NUMBER_PROPERTY, REMOVE_PHONE_NUMBER_PROPERTY, RESET_ADD_PHONE_NUMBER_PROPERTY } from '../../callee-properties/actions/asyncActionTypes';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestSucceeded } from 'conversations-async-data/async-data/operators/requestSucceeded';
var initialState = AsyncData({
  data: null
});
var calleesUpdates = (_calleesUpdates = {}, _defineProperty(_calleesUpdates, ADD_PHONE_NUMBER_PROPERTY.STARTED, requestStarted), _defineProperty(_calleesUpdates, ADD_PHONE_NUMBER_PROPERTY.SUCCEEDED, requestSucceeded), _defineProperty(_calleesUpdates, ADD_PHONE_NUMBER_PROPERTY.FAILED, requestFailed), _defineProperty(_calleesUpdates, RESET_ADD_PHONE_NUMBER_PROPERTY, function () {
  return initialState;
}), _defineProperty(_calleesUpdates, REMOVE_PHONE_NUMBER_PROPERTY.STARTED, requestStarted), _defineProperty(_calleesUpdates, REMOVE_PHONE_NUMBER_PROPERTY.SUCCEEDED, requestSucceeded), _defineProperty(_calleesUpdates, REMOVE_PHONE_NUMBER_PROPERTY.FAILED, requestFailed), _calleesUpdates);
export default handleActions(calleesUpdates, initialState);