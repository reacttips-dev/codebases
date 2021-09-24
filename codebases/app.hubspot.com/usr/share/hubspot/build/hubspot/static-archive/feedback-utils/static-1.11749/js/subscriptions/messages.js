'use es6';

import { FEEDBACK_TYPE } from '../messages';
import { getOrigin } from '../urls';
import eventAggregator from './events';

var messageAggregator = function messageAggregator(url, channel) {
  var originTest = new RegExp("^" + getOrigin(url));
  var subscribe = eventAggregator(window, 'message');
  return function (subscriber) {
    return subscribe(function (_ref) {
      var data = _ref.data,
          origin = _ref.origin,
          source = _ref.source;
      if (!(data && originTest.test(origin))) return;
      var message;

      try {
        message = JSON.parse(data);
      } catch (e) {
        return;
      }

      var _message = message,
          payload1 = _message.payload,
          type = _message.type;
      if (!(payload1 && type === FEEDBACK_TYPE)) return;
      var messageChannel = payload1.channel,
          _payload1$payload = payload1.payload,
          messageType = _payload1$payload.messageType,
          payload2 = _payload1$payload.payload;
      if (messageChannel !== channel) return;
      subscriber(messageType, payload2, origin, source);
    });
  };
};

export var parentListener = function parentListener(channel) {
  return messageAggregator(document.referrer, channel);
};
export var frameListener = function frameListener(iframe, channel) {
  return messageAggregator(iframe.src, channel);
};
export default messageAggregator;