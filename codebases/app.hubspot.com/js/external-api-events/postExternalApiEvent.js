'use es6';

import { postMessageToParent } from '../post-message/postMessageToParent';
import { EXTERNAL_API_EVENT } from './constants/externalApiEventsPostMessageTypes';
export var postExternalApiEvent = function postExternalApiEvent(_ref) {
  var eventType = _ref.eventType,
      payload = _ref.payload;
  postMessageToParent(EXTERNAL_API_EVENT, {
    eventType: eventType,
    payload: payload
  });
};