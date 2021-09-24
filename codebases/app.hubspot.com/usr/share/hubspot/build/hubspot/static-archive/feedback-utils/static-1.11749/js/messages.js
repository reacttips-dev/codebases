'use es6';

import { frameListener } from './subscriptions/messages';
import * as MessageTypes from 'feedback-schema/constants/messageTypes';
export var FEEDBACK_TYPE = 'hubspot-servicehub-feedback';

var getSender = function getSender(channel, targetWindow, targetOrigin) {
  return function (messageType, payload) {
    targetWindow.postMessage(JSON.stringify({
      payload: {
        channel: channel,
        payload: {
          messageType: messageType,
          payload: payload
        }
      },
      type: FEEDBACK_TYPE
    }), targetOrigin || '*');
  };
};

export var iframeSender = function iframeSender(iframe, channel) {
  return getSender(channel, iframe.contentWindow, iframe.src);
};
export var parentSender = function parentSender(channel) {
  return getSender(channel, window.parent, document.referrer);
};
export var onFrameReady = function onFrameReady(frame, channel, callback) {
  var subscribe = frameListener(frame, channel);
  var sender = iframeSender(frame, channel);
  var unsubscribe = subscribe(function (type) {
    if (type === MessageTypes.READY) {
      callback({
        sender: sender,
        subscribe: subscribe
      });
      unsubscribe();
    }
  });
};