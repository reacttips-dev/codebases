'use es6';

import UUID from '../utils/UUID';
export var MSG_FORMAT_HS_IFR = '__hs-ifr';
export var MSG_FORMAT_VERSION = 1;
export var TO_ALL = 'ALL';
export var isOfType = function isOfType(message, type) {
  return message.payload.type === type;
};
export var validFormat = function validFormat(_ref) {
  var format = _ref.format,
      v = _ref.v;
  return format === MSG_FORMAT_HS_IFR && v > 0 && v <= MSG_FORMAT_VERSION;
};
export var createMessage = function createMessage(type, data, _ref2) {
  var to = _ref2.to,
      from = _ref2.from;
  return {
    id: UUID(),
    format: MSG_FORMAT_HS_IFR,
    from: from,
    to: to,
    v: MSG_FORMAT_VERSION,
    payload: Object.assign({
      type: type
    }, data)
  };
};
export var createReplyMessage = function createReplyMessage(replyToMessage, type, data) {
  return Object.assign({}, createMessage(type, data, {
    from: replyToMessage.to,
    to: replyToMessage.from
  }), {
    id: replyToMessage.id
  });
};
export var createDirectedMessage = function createDirectedMessage(type, data, _ref3) {
  var to = _ref3.to,
      from = _ref3.from;
  return createMessage(type, data, {
    to: to,
    from: from
  });
};
export var createDirectedReplyMessage = createReplyMessage;
export var createBroadcastMessage = function createBroadcastMessage(type, data, _ref4) {
  var from = _ref4.from,
      group = _ref4.group;
  return Object.assign({}, createMessage(type, data, {
    to: TO_ALL,
    from: from
  }), {
    group: group
  });
};
export var createBroadcastReplyMessage = function createBroadcastReplyMessage(replyToMessage, type, data, from) {
  return Object.assign({}, createReplyMessage(replyToMessage, type, data), {
    from: from
  });
};
export var isBroadcastMessageToMyGroup = function isBroadcastMessageToMyGroup(message, group) {
  return message.to === TO_ALL && message.group === group;
};
export var isMessageToMe = function isMessageToMe(message, myId, myGroup) {
  return message.to === myId || isBroadcastMessageToMyGroup(message, myGroup);
};