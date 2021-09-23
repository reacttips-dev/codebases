'use es6'; // This API is meant for internal use only between `UIIFrame` and `UIEmbeddedComponent`

import { createBroadcastMessage, createBroadcastReplyMessage, createDirectedMessage, createMessage, createReplyMessage, isOfType, validFormat } from './IFrameMessage';
export var IFRAME_HOST = 'HOST';
export var MSG_TYPE_SYNC = 'SYNC';
export var MSG_TYPE_SYNC_ACK = 'SYNC_ACK';
export var MSG_TYPE_READY = 'READY';
export var MSG_TYPE_EMBEDDED_PROPS_CHANGED = 'EMBEDDED_PROPS_CHANGED';

var createHostSendMessageContext = function createHostSendMessageContext(embedId, sendMessageFn) {
  return {
    sendMessage: function sendMessage(type) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      var message = createMessage(type, data, {
        to: embedId,
        from: IFRAME_HOST
      });
      sendMessageFn(message, callback);
    },
    sendReplyMessage: function sendReplyMessage(replyToMessage, type) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var callback = arguments.length > 3 ? arguments[3] : undefined;
      var message = createReplyMessage(replyToMessage, type, data);
      sendMessageFn(message, callback);
    }
  };
};

var createEmbeddedSendMessageContext = function createEmbeddedSendMessageContext(embedId, sendMessageFn) {
  return {
    sendMessage: function sendMessage(type) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var callback = arguments.length > 2 ? arguments[2] : undefined;
      var message = createMessage(type, data, {
        to: IFRAME_HOST,
        from: embedId
      });
      sendMessageFn(message, callback);
    },
    sendReplyMessage: function sendReplyMessage(replyToMessage, type) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var callback = arguments.length > 3 ? arguments[3] : undefined;
      var message = createReplyMessage(replyToMessage, type, data);
      sendMessageFn(message, callback);
    },
    sendDirectedMessage: function sendDirectedMessage(type, data, to, callback) {
      var message = createDirectedMessage(type, data, {
        to: to,
        from: embedId
      });
      sendMessageFn(message, callback);
    },
    sendBroadcastMessage: function sendBroadcastMessage(type, data, group) {
      var message = createBroadcastMessage(type, data, {
        from: embedId,
        group: group
      });
      sendMessageFn(message);
    },
    sendBroadcastReplyMessage: function sendBroadcastReplyMessage(replyToMessage, type, data) {
      var message = createBroadcastReplyMessage(replyToMessage, type, data, {
        from: embedId
      });
      sendMessageFn(message);
    }
  };
};

export var isSyncMessage = function isSyncMessage(message) {
  return isOfType(message, MSG_TYPE_SYNC);
};
export var isReadyMessage = function isReadyMessage(message) {
  return isOfType(message, MSG_TYPE_READY);
};
export var isEmbeddedPropsChangedMessage = function isEmbeddedPropsChangedMessage(message) {
  return isOfType(message, MSG_TYPE_EMBEDDED_PROPS_CHANGED);
};
export var isToIFrameHost = function isToIFrameHost(message) {
  return message.to === IFRAME_HOST;
};
export var createAppData = function createAppData(info, name) {
  return {
    info: info,
    name: name,
    url: window.location.href
  };
};
export var createHostContext = function createHostContext(embedId, sendMessageFn) {
  return Object.assign({
    id: embedId
  }, createHostSendMessageContext(embedId, sendMessageFn));
};
export var createEmbeddedContext = function createEmbeddedContext(_ref) {
  var embedId = _ref.embedId,
      group = _ref.group,
      name = _ref.name,
      app = _ref.app,
      sendMessageFn = _ref.sendMessageFn;
  return Object.assign({
    id: embedId,
    group: group,
    name: name,
    app: app
  }, createEmbeddedSendMessageContext(embedId, sendMessageFn));
};
export var createSyncMessage = function createSyncMessage(_ref2) {
  var embedId = _ref2.embedId,
      group = _ref2.group,
      name = _ref2.name,
      appData = _ref2.appData,
      embeddedProps = _ref2.embeddedProps;
  return createMessage(MSG_TYPE_SYNC, {
    embedId: embedId,
    group: group,
    name: name,
    appData: appData,
    embeddedProps: embeddedProps
  }, {
    to: embedId,
    from: IFRAME_HOST
  });
};
export var createSyncAckMessage = function createSyncAckMessage(syncMessage) {
  return createReplyMessage(syncMessage, MSG_TYPE_SYNC_ACK, {});
};
export var createReadyMessage = function createReadyMessage(from) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return createMessage(MSG_TYPE_READY, data, {
    to: IFRAME_HOST,
    from: from
  });
};
export var createEmbeddedPropsChangeMessage = function createEmbeddedPropsChangeMessage(embedId, embeddedProps) {
  return createMessage(MSG_TYPE_EMBEDDED_PROPS_CHANGED, embeddedProps, {
    to: embedId,
    from: IFRAME_HOST
  });
};
export var validMessage = function validMessage(_ref3, expectedOrigin) {
  var origin = _ref3.origin,
      data = _ref3.data;
  return origin === expectedOrigin && validFormat(data);
};