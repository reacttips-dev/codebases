'use es6';

import getIn from 'transmute/getIn';
export var getTypingTimeoutIdForAgentInThread = function getTypingTimeoutIdForAgentInThread(_ref) {
  var threadId = _ref.threadId,
      senderId = _ref.senderId,
      typingStates = _ref.typingStates;
  return getIn([threadId, senderId], typingStates);
};