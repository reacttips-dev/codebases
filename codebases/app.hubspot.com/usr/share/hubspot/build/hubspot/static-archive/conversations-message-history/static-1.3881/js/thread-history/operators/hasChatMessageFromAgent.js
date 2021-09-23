'use es6';

import { isChatMessage } from '../../common-message-format/operators/cmfComparators';
import { isFromAgent } from '../../common-message-format/operators/senderTypeComparators';
import { getMessages } from './getMessages';
export var hasChatMessageFromAgent = function hasChatMessageFromAgent(threadHistory) {
  var messages = getMessages(threadHistory);
  return messages.some(function (message) {
    return isChatMessage(message) && isFromAgent(message);
  });
};