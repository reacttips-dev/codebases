'use es6';

import { getSenderId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { isFromVisitor } from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
import { TYPING_INDICATOR_TIMEOUT_MS } from '../constants/typingStateConstants';
import { addTypingTimeoutIdForAgentInThread } from './addTypingTimeoutIdForAgentInThread';
import { dismissTypingIndicator } from './dismissTypingIndicator';
import { clearExistingTypingTimeout } from './clearExistingTypingTimeout';
export var typingMessageReceived = function typingMessageReceived(message, threadId) {
  return function (dispatch) {
    if (isFromVisitor(message)) {
      return;
    }

    var senderId = getSenderId(message);
    dispatch(clearExistingTypingTimeout(message, threadId));
    var timeoutId = setTimeout(function () {
      dispatch(dismissTypingIndicator(message, threadId));
    }, TYPING_INDICATOR_TIMEOUT_MS);
    dispatch(addTypingTimeoutIdForAgentInThread(threadId, senderId, timeoutId));
  };
};