'use es6';

import { createAction } from 'flux-actions';
import { REMOVE_TYPING_TIMEOUT_ID } from '../constants/typingIndicatorActionTypes';
export var removeTypingTimeoutIdForAgentInThread = createAction(REMOVE_TYPING_TIMEOUT_ID, function (threadId, senderId) {
  return {
    threadId: threadId,
    senderId: senderId
  };
});