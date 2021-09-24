'use es6';

import { isEmailCapturePromptMessage } from 'conversations-message-history/email-capture-prompt/operators/isEmailCapturePromptMessage';
import { isEmailCaptureResponseMessage } from 'conversations-message-history/email-capture-response/operators/isEmailCaptureResponseMessage';
import { isOfficeHoursMessage } from 'conversations-message-history/office-hours-message/operators/isOfficeHoursMessage';
import { isTypicalResponseTimeMessage } from 'conversations-message-history/typical-response-time/operators/isTypicalResponseTimeMessage';
import { isFromVisitor } from 'conversations-message-history/common-message-format/operators/senderTypeComparators';
export var sentByVisitorClient = function sentByVisitorClient(message) {
  return isFromVisitor(message) || isEmailCapturePromptMessage(message) || isEmailCaptureResponseMessage(message) || isTypicalResponseTimeMessage(message) || isOfficeHoursMessage(message);
};