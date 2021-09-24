'use es6';

import memoize from 'transmute/memoize';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { isConversationalMessage } from 'conversations-message-history/common-message/operators/isConversationalMessage';
import { isAutomatedChatMessage } from 'conversations-message-history/common-message/operators/isAutomatedChatMessage';
import { isFromAgent } from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
import { getCustomEmailCaptureDelay } from '../../selectors/widgetDataSelectors/getCustomEmailCaptureDelay';
import { shouldCaptureVisitorEmailAddress } from '../../selectors/widgetDataSelectors/shouldCaptureVisitorEmailAddress';
import { widgetIsInAwayMode } from '../../availability/selectors/widgetIsInAwayMode';
import publishEmailCapturePromptMessage from '../actions/publishEmailCapturePromptMessage';
import { getSelectedThread } from '../../selected-thread/selectors/getSelectedThread';
import { CREATE_NEW_THREAD } from '../../thread-create/constants/actionTypes';
import { getThreadId, getChannelName } from '../../threads/operators/threadGetters';
import { isClientReady } from 'conversations-internal-pub-sub/redux/operators/isClientReady';
import { getAsyncPubSubClient } from 'conversations-internal-pub-sub/redux/selectors/pubSubClientGetters';
import { getAssignedResponderInWidget } from '../../responders/selectors/getAssignedResponderInWidget';
import { getAgentType } from 'conversations-internal-schema/responders/operators/getAgentType';
import { BOT } from 'conversations-message-history/common-message-format/constants/legacySenderTypes';
var DEFAULT_AGENT_JOIN_TIMEOUT_IN_MS = 1000;

var AgentResponseTimeoutMiddleware = function AgentResponseTimeoutMiddleware(store) {
  return function (next) {
    var timeouts = {};

    var clearResponseTimeout = function clearResponseTimeout(threadId) {
      return clearTimeout(timeouts[threadId]);
    };

    var setResponseTimeout = memoize(function (threadId, channel, delay) {
      timeouts[threadId] = setTimeout(function () {
        store.dispatch(publishEmailCapturePromptMessage({
          channel: channel,
          threadId: threadId
        }));
      }, delay);
    });
    return function (action) {
      switch (action.type) {
        case ActionTypes.THREAD_CREATED_AND_NETWORK_ONLINE:
        case CREATE_NEW_THREAD.SUCCEEDED:
          {
            var asyncPubSubClient = getAsyncPubSubClient(store.getState());

            if (!isClientReady(asyncPubSubClient)) {
              break;
            }

            var threadId;
            var channel;

            if (action.type === CREATE_NEW_THREAD.SUCCEEDED) {
              threadId = action.payload.threadId;
              channel = action.payload.channel;
            }

            if (action.type === ActionTypes.THREAD_CREATED_AND_NETWORK_ONLINE) {
              var thread = getSelectedThread(store.getState());
              channel = getChannelName(thread);
              threadId = getThreadId(thread);
            }

            var isInAwayMode = widgetIsInAwayMode(store.getState());
            var responderIsBot = getAgentType(getAssignedResponderInWidget(store.getState())) === BOT;
            /**
             * Once the visitor publishes his/her first message,
             * start a timer for a custom delay, if specified, or a standard delay
             */

            if (!responderIsBot && (isInAwayMode || shouldCaptureVisitorEmailAddress(store.getState()))) {
              var customDelay = getCustomEmailCaptureDelay(store.getState());
              var timeout = isInAwayMode ? DEFAULT_AGENT_JOIN_TIMEOUT_IN_MS : customDelay || DEFAULT_AGENT_JOIN_TIMEOUT_IN_MS;
              setResponseTimeout(threadId, channel, timeout);
            }

            break;
          }

        case ActionTypes.RECEIVED_INCOMING_MESSAGE:
          {
            var _action$payload = action.payload,
                message = _action$payload.message,
                _threadId = _action$payload.threadId;
            /**
             * When a non-automated, conversational message is received from an agent,
             * cancel the timer
             */

            if (isConversationalMessage(message) && !isAutomatedChatMessage(message) && isFromAgent(message)) {
              clearResponseTimeout(_threadId);
            }

            break;
          }

        default:
          break;
      }

      return next(action);
    };
  };
};

export default AgentResponseTimeoutMiddleware;