'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _handleActions;

import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { requestFailedWithOperator } from 'conversations-async-data/async-data/operators/requestFailedWithOperator';
import { requestStartedWithOperator } from 'conversations-async-data/async-data/operators/requestStartedWithOperator';
import IndexedAsyncData from 'conversations-async-data/indexed-async-data/IndexedAsyncData';
import { deleteEntry } from 'conversations-async-data/indexed-async-data/operators/deleteEntry';
import { updateEntry } from 'conversations-async-data/indexed-async-data/operators/updateEntry';
import { messageKeyInvariant } from 'conversations-message-history/thread-history/invariants/messageKeyInvariant';
import { getId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import ActivelyPublishing from 'conversations-message-history/unpublished-messages/records/ActivelyPublishing';
import FailedToPublish from 'conversations-message-history/unpublished-messages/records/FailedToPublish';
import { handleActions } from 'flux-actions';
import { REMOVE_MESSAGE_IN_CONVERSATION } from '../../thread-histories/constants/ActionTypes';
import { PUBLISH_MESSAGE } from '../constants/asyncActionTypes';
var initialState = IndexedAsyncData({
  notSetValue: AsyncData({
    data: null
  }),
  // TODO CMF; replace with a proper id invariant
  idTransform: function idTransform(id) {
    return id;
  },
  idInvariant: messageKeyInvariant
});
export default handleActions((_handleActions = {}, _defineProperty(_handleActions, PUBLISH_MESSAGE.STARTED, function (state, action) {
  var _action$payload = action.payload,
      messageKey = _action$payload.messageKey,
      threadId = _action$payload.threadId,
      channel = _action$payload.channel,
      message = _action$payload.message;
  return updateEntry(messageKey, requestStartedWithOperator(function () {
    return ActivelyPublishing({
      threadId: threadId,
      channel: channel,
      message: message
    });
  }), state);
}), _defineProperty(_handleActions, PUBLISH_MESSAGE.SUCCEEDED, function (state, action) {
  var messageKey = action.payload.messageKey;
  return deleteEntry(messageKey, state);
}), _defineProperty(_handleActions, PUBLISH_MESSAGE.FAILED, function (state, action) {
  var _action$payload2 = action.payload,
      messageKey = _action$payload2.messageKey,
      threadId = _action$payload2.threadId,
      channel = _action$payload2.channel,
      message = _action$payload2.message;
  return updateEntry(messageKey, requestFailedWithOperator(function () {
    return FailedToPublish({
      threadId: threadId,
      channel: channel,
      message: message
    });
  }), state);
}), _defineProperty(_handleActions, REMOVE_MESSAGE_IN_CONVERSATION, function (state, action) {
  var message = action.payload.message;
  var messageKey = getId(message);
  return deleteEntry(messageKey, state);
}), _handleActions), initialState);