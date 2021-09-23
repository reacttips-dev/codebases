'use es6';

import { postExternalApiEvent } from '../../external-api-events/postExternalApiEvent';
import { UNREAD_CONVERSATION_COUNT_CHANGED } from '../../external-api-events/constants/externalApiEventTypes';
export var postUnreadConversationCountChangedEvent = function postUnreadConversationCountChangedEvent(_ref) {
  var unreadCount = _ref.unreadCount;
  postExternalApiEvent({
    eventType: UNREAD_CONVERSATION_COUNT_CHANGED,
    payload: {
      unreadCount: unreadCount
    }
  });
};