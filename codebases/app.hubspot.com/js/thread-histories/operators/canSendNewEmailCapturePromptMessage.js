'use es6';

import { hasBotMessages } from 'conversations-message-history/thread-history/operators/hasBotMessages';
import { hasEmailCapturePromptFromCurrentSession } from './hasEmailCapturePromptFromCurrentSession';
import { hasAgentReplyFromCurrentSession } from './hasAgentReplyFromCurrentSession';
import { enoughTimeHasPassedForNewAutomatedChatMessage } from './enoughTimeHasPassedForNewAutomatedChatMessage';
export var canSendNewEmailCapturePromptMessage = function canSendNewEmailCapturePromptMessage(threadHistory) {
  return !hasAgentReplyFromCurrentSession(threadHistory) && !hasBotMessages(threadHistory) && (!hasEmailCapturePromptFromCurrentSession(threadHistory) || enoughTimeHasPassedForNewAutomatedChatMessage(threadHistory));
};