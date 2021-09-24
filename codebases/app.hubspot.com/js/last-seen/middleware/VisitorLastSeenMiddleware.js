'use es6';

import { getChannelName } from '../../threads/operators/threadGetters';
import { STUBBED_THREAD_ID } from '../../threads/constants/stubbedThreadId';
import * as ActionTypes from '../../constants/VisitorActionTypes';
import { markLastMessageReadByVisitor } from '../actions/markLastMessageReadByVisitor';
import { getIsOpen } from '../../selectors/getIsOpen';
import { clearUnseenCountForChannel } from '../../actions/ConversationsActions/clearUnseenCountForChannel';
import { isActiveOnThread } from '../../selectors/clientSelectors/isActiveOnThread';
import { sentByVisitorClient } from '../../pubnub-message/operators/sentByVisitorClient';
import { getTimestamp } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { isConversationalMessage } from 'conversations-message-history/common-message/operators/isConversationalMessage';
import { getSelectedThreadId } from '../../selected-thread/selectors/getSelectedThreadId';
import { getThreadByThreadId } from '../../threads/selectors/getThreadByThreadId';
import { SELECT_THREAD } from '../../selected-thread/constants/selectedThreadActionTypes';

var markLastMessageRead = function markLastMessageRead(_ref) {
  var store = _ref.store,
      conversation = _ref.conversation,
      messageTimestamp = _ref.messageTimestamp;
  store.dispatch(markLastMessageReadByVisitor({
    conversation: conversation,
    messageTimestamp: messageTimestamp
  }));
};

var VisitorLastSeenMiddleware = function VisitorLastSeenMiddleware(store) {
  return function (next) {
    return function (action) {
      var state = store.getState();
      var selectedThreadId = getSelectedThreadId(state);
      var widgetIsOpen = getIsOpen(state);

      if (action.type === SELECT_THREAD) {
        var threadId = action.payload.threadId;

        var _conversation = getThreadByThreadId(state, {
          threadId: threadId
        });

        var channel = getChannelName(_conversation);

        if (!!threadId && !!_conversation) {
          var prevThreadId = getSelectedThreadId(state);

          if (prevThreadId !== STUBBED_THREAD_ID && threadId !== STUBBED_THREAD_ID && prevThreadId !== threadId && widgetIsOpen) {
            markLastMessageRead({
              store: store,
              conversation: _conversation
            });
            store.dispatch(clearUnseenCountForChannel({
              channel: channel,
              threadId: threadId
            }));
          }
        }
      }

      if (action.type === ActionTypes.RECEIVED_INCOMING_MESSAGE) {
        var currentState = store.getState();
        var _action$payload = action.payload,
            _channel = _action$payload.channel,
            message = _action$payload.message,
            _threadId = _action$payload.threadId;

        if (_channel && isConversationalMessage(message) && !sentByVisitorClient(message) && isActiveOnThread(currentState, _threadId)) {
          var _conversation2 = getThreadByThreadId(state, {
            threadId: _threadId
          });

          var messageTimestamp = getTimestamp(message);
          markLastMessageRead({
            store: store,
            conversation: _conversation2,
            messageTimestamp: messageTimestamp
          });
          store.dispatch(clearUnseenCountForChannel({
            threadId: _threadId
          }));
        }
      }

      var conversation = getThreadByThreadId(state, {
        threadId: selectedThreadId
      });

      if (action.type === ActionTypes.APP_IN_FOREGROUND) {
        if (widgetIsOpen && conversation) {
          markLastMessageRead({
            store: store,
            conversation: conversation
          });
          store.dispatch(clearUnseenCountForChannel({
            threadId: selectedThreadId
          }));
        }
      }

      if (action.type === ActionTypes.TOGGLE_OPEN) {
        var _ref2 = action.payload || {},
            widgetWillOpen = _ref2.isOpened;

        if (widgetWillOpen && conversation) {
          markLastMessageRead({
            store: store,
            conversation: conversation
          });
          store.dispatch(clearUnseenCountForChannel({
            threadId: selectedThreadId
          }));
        }
      }

      return next(action);
    };
  };
};

export default VisitorLastSeenMiddleware;