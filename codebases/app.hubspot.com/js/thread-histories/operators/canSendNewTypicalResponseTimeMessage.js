'use es6';

import { hasBotMessages } from 'conversations-message-history/thread-history/operators/hasBotMessages';
import { hasTypicalResponseTimeMessageFromCurrentSession } from './hasTypicalResponseTimeMessageFromCurrentSession';
import { enoughTimeHasPassedForNewAutomatedChatMessage } from './enoughTimeHasPassedForNewAutomatedChatMessage';
export var canSendNewTypicalResponseTimeMessage = function canSendNewTypicalResponseTimeMessage(thread) {
  return !hasBotMessages(thread) && (!hasTypicalResponseTimeMessageFromCurrentSession(thread) || enoughTimeHasPassedForNewAutomatedChatMessage(thread));
};