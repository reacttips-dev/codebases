'use es6';

import { getSenderId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { clearExistingTypingTimeout } from './clearExistingTypingTimeout';
import { removeTypingTimeoutIdForAgentInThread } from './removeTypingTimeoutIdForAgentInThread';
export var dismissTypingIndicator = function dismissTypingIndicator(message, threadId) {
  return function (dispatch) {
    var senderId = getSenderId(message);
    dispatch(clearExistingTypingTimeout(message, threadId));
    dispatch(removeTypingTimeoutIdForAgentInThread(threadId, senderId));
  };
};