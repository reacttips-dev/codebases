'use es6';

import { getSenderId } from 'conversations-message-history/common-message-format/operators/commonMessageFormatGetters';
import { typingStates as typingStatesSelector } from '../selectors/typingStates';
import { getTypingTimeoutIdForAgentInThread } from '../operators/getTypingTimeoutIdForAgentInThread';
export var clearExistingTypingTimeout = function clearExistingTypingTimeout(message, threadId) {
  return function (dispatch, getState) {
    var senderId = getSenderId(message);
    var typingStates = typingStatesSelector(getState());
    var existingTimeoutId = getTypingTimeoutIdForAgentInThread({
      threadId: "" + threadId,
      senderId: "" + senderId,
      typingStates: typingStates
    });

    if (typeof existingTimeoutId === 'number') {
      clearTimeout(existingTimeoutId);
    }
  };
};