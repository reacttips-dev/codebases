'use es6';

import { postExternalApiEvent } from '../../external-api-events/postExternalApiEvent';
import { CONVERSATION_CLOSED } from '../../external-api-events/constants/externalApiEventTypes';
import { serializeThreadForExternalEvent } from '../../external-api-events/util/serializeThreadForExternalEvent';
export var postConversationClosedEvent = function postConversationClosedEvent(_ref) {
  var thread = _ref.thread;
  postExternalApiEvent({
    eventType: CONVERSATION_CLOSED,
    payload: {
      conversation: serializeThreadForExternalEvent(thread)
    }
  });
};