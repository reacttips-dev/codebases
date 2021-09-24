'use es6';

import { createAction } from 'flux-actions';
import { REMOVE_MESSAGE_IN_CONVERSATION } from '../constants/ActionTypes';
export var removeMessageInConversation = createAction(REMOVE_MESSAGE_IN_CONVERSATION, function (_ref) {
  var message = _ref.message,
      threadId = _ref.threadId;
  return {
    message: message,
    threadId: threadId
  };
});