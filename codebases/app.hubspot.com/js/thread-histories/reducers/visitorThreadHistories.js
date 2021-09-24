'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { updateAsyncData } from 'conversations-async-data/async-data/operators/updateAsyncData';
import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import { updateEntry } from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import { getId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { addPageOfMessagesToThreadHistory } from 'conversations-message-history/thread-history/operators/addPageOfMessagesToThreadHistory';
import { removeMessageFromThreadHistory } from 'conversations-message-history/thread-history/operators/removeMessageFromThreadHistory';
import { updateMessageInThreadHistory } from 'conversations-message-history/thread-history/operators/updateMessageInThreadHistory';
import ThreadHistory from 'conversations-message-history/thread-history/records/ThreadHistory';
import { handleActions } from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { PUBLISH_MESSAGE } from '../../pubsub/constants/asyncActionTypes';
import { CREATE_NEW_THREAD } from '../../thread-create/constants/actionTypes';
import { FETCH_THREAD_HISTORY, REMOVE_MESSAGE_IN_CONVERSATION } from '../constants/ActionTypes';
import { addMessageToThreadHistory } from '../operators/addMessageToThreadHistory';
var initialState = IndexedAsyncData({
  notSetValue: AsyncData({
    data: new ThreadHistory()
  })
});
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, CREATE_NEW_THREAD.SUCCEEDED, function (state, action) {
  var _action$payload = action.payload,
      threadId = _action$payload.threadId,
      threadHistory = _action$payload.threadHistory;
  return updateEntry(threadId, requestSucceededWithOperator(function () {
    return threadHistory;
  }), state);
}), _defineProperty(_handleActions, FETCH_THREAD_HISTORY.STARTED, function (state, action) {
  var requestArgs = action.payload.requestArgs;
  return updateEntry(requestArgs.threadId, requestStarted, state);
}), _defineProperty(_handleActions, FETCH_THREAD_HISTORY.SUCCEEDED, function (state, action) {
  var _action$payload2 = action.payload,
      requestArgs = _action$payload2.requestArgs,
      newHistoryPage = _action$payload2.data.threadHistory;
  return updateEntry(requestArgs.threadId, requestSucceededWithOperator(addPageOfMessagesToThreadHistory(newHistoryPage)), state);
}), _defineProperty(_handleActions, FETCH_THREAD_HISTORY.FAILED, function (state, action) {
  var requestArgs = action.payload.requestArgs;
  return updateEntry(requestArgs.threadId, requestFailed, state);
}), _defineProperty(_handleActions, ActionTypes.RECEIVED_INCOMING_MESSAGE, function (state, action) {
  var _action$payload3 = action.payload,
      message = _action$payload3.message,
      threadId = _action$payload3.threadId;
  var messageKey = getId(message);
  return updateEntry(threadId, updateAsyncData(addMessageToThreadHistory(messageKey, message)), state);
}), _defineProperty(_handleActions, PUBLISH_MESSAGE.SUCCEEDED, function (state, action) {
  var _action$payload4 = action.payload,
      publishedMessage = _action$payload4.publishedMessage,
      threadId = _action$payload4.threadId;
  var messageKey = getId(publishedMessage);
  return updateEntry(threadId, updateAsyncData(addMessageToThreadHistory(messageKey, publishedMessage)), state);
}), _defineProperty(_handleActions, REMOVE_MESSAGE_IN_CONVERSATION, function (state, action) {
  var _action$payload5 = action.payload,
      message = _action$payload5.message,
      threadId = _action$payload5.threadId;
  var messageKey = getId(message);
  return updateEntry(threadId, updateAsyncData(removeMessageFromThreadHistory(messageKey, message)), state);
}), _defineProperty(_handleActions, ActionTypes.UPDATE_MESSAGE_IN_CONVERSATION, function (state, action) {
  var _action$payload6 = action.payload,
      message = _action$payload6.message,
      threadId = _action$payload6.threadId,
      updated = _action$payload6.updated;
  var messageKey = getId(message);
  return updateEntry(threadId, updateAsyncData(updateMessageInThreadHistory(messageKey, updated)), state);
}), _handleActions), initialState);