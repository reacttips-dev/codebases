'use es6';

import invariant from 'react-utils/invariant';
import CommonMessage from 'conversations-message-history/common-message-format/records/CommonMessage';
import ContextUpdateMessage from 'conversations-message-history/context-update/records/ContextUpdateMessage';
import InitialMessage from 'conversations-message-history/initial-message/records/InitialMessage';
import FailedToPublish from 'conversations-message-history/unpublished-messages/records/FailedToPublish';
import TypingIndicatorMessage from 'conversations-message-history/typing-indicator/records/TypingIndicatorMessage';
import EmailCapturePromptMessage from 'conversations-message-history/email-capture-prompt/records/EmailCapturePromptMessage';
import EmailCaptureResponseMessage from 'conversations-message-history/email-capture-response/records/EmailCaptureResponseMessage';
import OfficeHoursMessage from 'conversations-message-history/office-hours-message/records/OfficeHoursMessage';
import ReadThreadMessage from 'conversations-message-history/read-thread-message/records/ReadThreadMessage';
import ThreadStatusUpdateMessage from 'conversations-message-history/thread-status-update/records/ThreadStatusUpdateMessage';
import TypicalResponseTimeMessage from 'conversations-message-history/typical-response-time/records/TypicalResponseTimeMessage';
import AssignmentUpdateMessage from 'conversations-message-history/assignment-update-message/records/AssignmentUpdateMessage';
import FeedbackSurveyMessage from 'conversations-message-history/feedback-survey-message/records/FeedbackSurveyMessage';
import { getRecordName } from '../../utils/getRecordName';
var validRecordTypes = [AssignmentUpdateMessage, CommonMessage, ContextUpdateMessage, FailedToPublish, InitialMessage, TypingIndicatorMessage, EmailCapturePromptMessage, EmailCaptureResponseMessage, OfficeHoursMessage, ReadThreadMessage, ThreadStatusUpdateMessage, TypicalResponseTimeMessage, FeedbackSurveyMessage];
export var historyMessageInvariant = function historyMessageInvariant(message) {
  return invariant(validRecordTypes.some(function (type) {
    return message instanceof type;
  }), "Expected message to be one of " + validRecordTypes.map(function (record) {
    return getRecordName(record);
  }).join(', ') + ", not a %s", typeof message);
};