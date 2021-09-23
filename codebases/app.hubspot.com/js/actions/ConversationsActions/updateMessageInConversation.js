'use es6';

import { createAction } from 'flux-actions';
import * as ActionTypes from '../../constants/VisitorActionTypes';
export var updateMessageInConversation = createAction(ActionTypes.UPDATE_MESSAGE_IN_CONVERSATION, function (_ref) {
  var updated = _ref.updated,
      channel = _ref.channel,
      message = _ref.message,
      threadId = _ref.threadId;
  return {
    updated: updated,
    channel: channel,
    message: message,
    threadId: threadId
  };
});