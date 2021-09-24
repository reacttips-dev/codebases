'use es6';

import { createAction } from 'flux-actions';
import { ADD_TYPING_TIMEOUT_ID } from '../constants/typingIndicatorActionTypes';
export var addTypingTimeoutIdForAgentInThread = createAction(ADD_TYPING_TIMEOUT_ID, function (threadId, senderId, timeoutId) {
  return {
    threadId: threadId,
    senderId: senderId,
    timeoutId: timeoutId
  };
});