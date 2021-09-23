'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestFailedWithError } from 'conversations-async-data/async-data/operators/requestFailedWithError';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestSucceeded } from 'conversations-async-data/async-data/operators/requestSucceeded';
import { updateAsyncData } from 'conversations-async-data/async-data/operators/updateAsyncData';
import { getId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import ThreadHistory from 'conversations-message-history/thread-history/records/ThreadHistory';
import { handleActions } from 'flux-actions';
import { RESET_STUBBED_THREAD, STAGE_MESSAGE_ON_STUBBED_THREAD } from '../../stubbed-thread-history/constants/StubbedThreadHistoryActionTypes';
import { addMessageToThreadHistory } from '../../thread-histories/operators/addMessageToThreadHistory';
import { CREATE_NEW_THREAD } from '../constants/actionTypes';
var initialState = AsyncData({
  data: new ThreadHistory()
});
export var stagedThread = handleActions((_handleActions = {}, _defineProperty(_handleActions, STAGE_MESSAGE_ON_STUBBED_THREAD, function (state, action) {
  var message = action.payload.message;
  return updateAsyncData(function (history) {
    return addMessageToThreadHistory(getId(message), message, history);
  }, state);
}), _defineProperty(_handleActions, RESET_STUBBED_THREAD, function () {
  return initialState;
}), _defineProperty(_handleActions, CREATE_NEW_THREAD.STARTED, requestStarted), _defineProperty(_handleActions, CREATE_NEW_THREAD.SUCCEEDED, requestSucceeded), _defineProperty(_handleActions, CREATE_NEW_THREAD.FAILED, function (state, action) {
  return requestFailedWithError(action.payload, state);
}), _handleActions), initialState);