'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";

var _handleActions;

import { Map as ImmutableMap } from 'immutable';
import { handleActions, combineActions } from 'flux-actions';
import set from 'transmute/set';
import get from 'transmute/get';
import merge from 'transmute/merge';
import update from 'transmute/update';
import Raven from 'Raven';
import { getData } from 'conversations-async-data/async-data/operators/getters';
import { updateAsyncData } from 'conversations-async-data/async-data/operators/updateAsyncData';
import { requestStarted } from 'conversations-async-data/async-data/operators/requestStarted';
import { requestSucceeded } from 'conversations-async-data/async-data/operators/requestSucceeded';
import { requestSucceededWithOperator } from 'conversations-async-data/async-data/operators/requestSucceededWithOperator';
import { requestFailed } from 'conversations-async-data/async-data/operators/requestFailed';
import AsyncData from 'conversations-async-data/async-data/AsyncData';
import { isConversationalMessage } from 'conversations-message-history/common-message/operators/isConversationalMessage';
import { isEmailCaptureResponseMessage } from 'conversations-message-history/email-capture-response/operators/isEmailCaptureResponseMessage';
import { isCloseThreadMessage } from 'conversations-message-history/thread-status-update/operators/isCloseThreadMessage';
import { isOpenThreadMessage } from 'conversations-message-history/thread-status-update/operators/isOpenThreadMessage';
import { isAssignmentUpdateMessage } from 'conversations-message-history/assignment-update-message/operators/isAssignmentUpdateMessage';
import { getThreadId } from '../operators/threadGetters';
import { setStatus } from '../operators/setStatus';
import ChatFilterOptions from 'conversations-internal-schema/constants/ChatFilterOptions';
import { setLatestReadTimestamp } from '../operators/setLatestReadTimestamp';
import { setLatestMessage } from '../operators/setLatestMessage';
import { setAssignedAgentFromAssignmentMessage } from '../operators/setAssignedAgentFromAssignmentMessage';
import { setCurrentUrl } from '../operators/setCurrentUrl';
import { PUBLISH_MESSAGE } from '../../pubsub/constants/asyncActionTypes';
import { SET_THREADS_SUCCESS, UPDATE_THREAD_CURRENT_URL } from '../constants/actionTypes';
import { CREATE_NEW_THREAD } from '../../thread-create/constants/actionTypes';
import { ADD_CONVERSATION, RECEIVED_INCOMING_MESSAGE, LAST_SEEN_SUCCESS, INCREMENT_UNSEEN_COUNT, CLEAR_UNSEEN_COUNT_FOR_CHANNEL, GET_VISITOR_THREADS_STARTED, GET_VISITOR_THREADS_SUCCESS, GET_VISITOR_THREADS_FAILURE } from '../../constants/VisitorActionTypes';
import { CHANNEL_CHANGE_RECEIVED } from '../../pubsub/constants/pubsubActionTypes';
import { getNewChannelName } from 'conversations-internal-pub-sub/channel-change/operators/channelChangeGetters';
import { CHANNEL_DETAILS } from '../constants/KeyPaths';
import { setChannelName } from '../../channel-details/operators/channelDetailsSetters';
var initialState = AsyncData({
  data: ImmutableMap()
});
export function updateLatestMessageAndThreadPreview(message) {
  return function (thread) {
    thread = setLatestMessage(message, thread);
    return thread;
  };
}
var threadsReducer = handleActions((_handleActions = {}, _defineProperty(_handleActions, combineActions(ADD_CONVERSATION, CREATE_NEW_THREAD.SUCCEEDED), function (state, action) {
  var conversation = action.payload.conversation;
  var threadId = getThreadId(conversation);
  return updateAsyncData(set(threadId, conversation), state);
}), _defineProperty(_handleActions, SET_THREADS_SUCCESS, function (state) {
  return requestSucceeded(state);
}), _defineProperty(_handleActions, LAST_SEEN_SUCCESS, function (state, action) {
  var _action$payload = action.payload,
      threadId = _action$payload.threadId,
      latestMessageTimestamp = _action$payload.latestMessageTimestamp;
  var data = getData(state);
  var existingThread = get(threadId, data);

  if (!existingThread || !latestMessageTimestamp) {
    return state;
  }

  return updateAsyncData(update(threadId, setLatestReadTimestamp(latestMessageTimestamp)), state);
}), _defineProperty(_handleActions, PUBLISH_MESSAGE.SUCCEEDED, function (state, action) {
  var _action$payload2 = action.payload,
      threadId = _action$payload2.threadId,
      publishedMessage = _action$payload2.publishedMessage;
  var updateFunc = isConversationalMessage(publishedMessage) && !isEmailCaptureResponseMessage(publishedMessage) ? updateLatestMessageAndThreadPreview : function () {
    return function (thread) {
      return thread;
    };
  };
  return updateAsyncData(update(threadId, updateFunc(publishedMessage)), state);
}), _defineProperty(_handleActions, RECEIVED_INCOMING_MESSAGE, function (state, action) {
  var _action$payload3 = action.payload,
      threadId = _action$payload3.threadId,
      message = _action$payload3.message;
  var updateFunc = isConversationalMessage(message) && !isEmailCaptureResponseMessage(message) ? updateLatestMessageAndThreadPreview : function () {
    return function (thread) {
      return thread;
    };
  };
  var newState = updateAsyncData(update(threadId, updateFunc(message)), state);

  if (isAssignmentUpdateMessage(message)) {
    return updateAsyncData(update(threadId, setAssignedAgentFromAssignmentMessage(message)), newState);
  }

  if (isCloseThreadMessage(message)) {
    return updateAsyncData(update(threadId, setStatus(ChatFilterOptions.ENDED)), newState);
  }

  if (isOpenThreadMessage(message)) {
    return updateAsyncData(update(threadId, setStatus(ChatFilterOptions.STARTED)), newState);
  }

  return newState;
}), _defineProperty(_handleActions, INCREMENT_UNSEEN_COUNT, function (state, action) {
  var threadId = action.payload.threadId;
  return updateAsyncData(update(threadId, update('unseenCount', function (unseenCount) {
    return unseenCount + 1;
  })), state);
}), _defineProperty(_handleActions, CLEAR_UNSEEN_COUNT_FOR_CHANNEL, function (state, action) {
  var threadId = action.payload.threadId;
  return updateAsyncData(update(threadId, set('unseenCount', 0)), state);
}), _defineProperty(_handleActions, GET_VISITOR_THREADS_STARTED, function (state) {
  return requestStarted(state);
}), _defineProperty(_handleActions, GET_VISITOR_THREADS_SUCCESS, function (state, action) {
  var threads = action.payload.threads;
  var newThreads = !threads || !threads.length ? ImmutableMap() : threads.reduce(function (newThreadsMap, newThread) {
    var threadId = getThreadId(newThread);
    return newThreadsMap.set(threadId, newThread);
  }, ImmutableMap());
  return requestSucceededWithOperator(merge(newThreads), state);
}), _defineProperty(_handleActions, GET_VISITOR_THREADS_FAILURE, function (state) {
  return requestFailed(state);
}), _defineProperty(_handleActions, UPDATE_THREAD_CURRENT_URL, function (state, action) {
  var _action$payload4 = action.payload,
      threadId = _action$payload4.threadId,
      currentUrl = _action$payload4.currentUrl;
  return updateAsyncData(function (threads) {
    return threads.update(threadId, setCurrentUrl(currentUrl));
  }, state);
}), _defineProperty(_handleActions, CHANNEL_CHANGE_RECEIVED, function (state, action) {
  var _action$payload5 = action.payload,
      threadId = _action$payload5.threadId,
      channelChange = _action$payload5.channelChange;
  var newChannelName = getNewChannelName(channelChange);
  return updateAsyncData(function (data) {
    return data.updateIn([threadId].concat(_toConsumableArray(CHANNEL_DETAILS)), setChannelName(newChannelName));
  }, state);
}), _handleActions), initialState);

var safeReducer = function safeReducer(reducer) {
  return function (state, action) {
    try {
      return reducer(state, action);
    } catch (e) {
      Raven.captureMessage('THREADS_REDUCER_ERROR', {
        extra: {
          error: e,
          state: state.toJS(),
          action: action
        }
      });
      return state;
    }
  };
};

export default safeReducer(threadsReducer);