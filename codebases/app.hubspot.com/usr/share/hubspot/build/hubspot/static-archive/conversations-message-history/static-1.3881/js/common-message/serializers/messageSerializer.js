'use es6';

import { buildCommentMessage } from '../../comment-message/operators/buildCommentMessage';
import { buildCommonMessage } from '../../common-message-format/operators/buildCommonMessage';
import { isCommonMessageFormat } from '../../common-message-format/operators/cmfComparators';
import { isContextUpdateMessage } from '../../context-update/operators/isContextUpdateMessage';
import ContextUpdateMessage from '../../context-update/records/ContextUpdateMessage';
import { isCrmObjectLifecycleUpdate } from '../../crm-object-lifecycle-update/operators/isCrmObjectLifecycleUpdate';
import CrmObjectLifecycleUpdate from '../../crm-object-lifecycle-update/records/CrmObjectLifecycleUpdate';
import { buildInitialMessage } from '../../initial-message/operators/buildInitialMessage';
import { isInitialMessage } from '../../initial-message/operators/isInitialMessage';
import { isMessagesUpdateMessage } from '../../message-updates/operators/isMessagesUpdateMessage';
import MessagesUpdates from '../../message-updates/records/MessagesUpdates';
import TypingIndicatorMessage from '../../typing-indicator/records/TypingIndicatorMessage';
import ReadThreadMessage from '../../read-thread-message/records/ReadThreadMessage';
import InboxUpdateMessage from '../../inbox-update-message/records/InboxUpdateMessage';
import ContactAssociationMessage from '../../contact-association-message/records/ContactAssociationMessage';
import { isTypingMessage } from '../../typing-indicator/operators/isTypingMessage';
import { isContactAssociationMessage } from '../../contact-association-message/operators/isContactAssociationMessage';
import { isInboxUpdateMessage } from '../../inbox-update-message/operators/isInboxUpdateMessage';
import { isReadThreadMessage } from '../../read-thread-message/operators/isReadThreadMessage';
import { isThreadComment } from '../../comment-message/operators/cmComparators';
import { isEmailCapturePromptMessage } from '../../email-capture-prompt/operators/isEmailCapturePromptMessage';
import { isEmailCaptureResponseMessage } from '../../email-capture-response/operators/isEmailCaptureResponseMessage';
import { isOfficeHoursMessage } from '../../office-hours-message/operators/isOfficeHoursMessage';
import { isFilteredChangeMessage } from '../../filtered-change-message/operators/isFilteredChangeMessage';
import { isThreadStatusUpdateMessage } from '../../thread-status-update/operators/isThreadStatusUpdateMessage';
import OfficeHoursMessage from '../../office-hours-message/records/OfficeHoursMessage';
import { isTypicalResponseTimeMessage } from '../../typical-response-time/operators/isTypicalResponseTimeMessage';
import EmailCapturePromptMessage from '../../email-capture-prompt/records/EmailCapturePromptMessage';
import EmailCaptureResponseMessage from '../../email-capture-response/records/EmailCaptureResponseMessage';
import AgentAvailabilityMessage from '../../agent-availability-message/records/AgentAvailabilityMessage';
import { isAgentAvailabilityMessage } from '../../agent-availability-message/operators/isAgentAvailabilityMessage';
import TypicalResponseTimeMessage from '../../typical-response-time/records/TypicalResponseTimeMessage';
import FilteredChangeMessage from '../../filtered-change-message/records/FilteredChangeMessage';
import ThreadStatusUpdateMessage from '../../thread-status-update/records/ThreadStatusUpdateMessage';
import { isAssignmentUpdateMessage } from '../../assignment-update-message/operators/isAssignmentUpdateMessage';
import AssignmentUpdateMessage from '../../assignment-update-message/records/AssignmentUpdateMessage';
import { isFeedbackSurveyMessage } from '../../feedback-survey-message/operators/isFeedbackSurveyMessage';
import FeedbackSurveyMessage from '../../feedback-survey-message/records/FeedbackSurveyMessage';
export function serialize(message) {
  return message.toJS();
}
export function deserialize(_ref) {
  var json = _ref.json;

  if (isMessagesUpdateMessage(json)) {
    return new MessagesUpdates(json);
  }

  if (isThreadComment(json)) {
    return buildCommentMessage(json);
  }

  if (isCommonMessageFormat(json)) {
    return buildCommonMessage(json);
  }

  if (isInitialMessage(json)) {
    return buildInitialMessage(json);
  }

  if (isCrmObjectLifecycleUpdate(json)) {
    return new CrmObjectLifecycleUpdate(json);
  }

  if (isContextUpdateMessage(json)) {
    return new ContextUpdateMessage(json);
  }

  if (isTypingMessage(json)) {
    return new TypingIndicatorMessage(json);
  }

  if (isContactAssociationMessage(json)) {
    return new ContactAssociationMessage(json);
  }

  if (isEmailCaptureResponseMessage(json)) {
    return new EmailCaptureResponseMessage(json);
  }

  if (isEmailCapturePromptMessage(json)) {
    return new EmailCapturePromptMessage(json);
  }

  if (isOfficeHoursMessage(json)) {
    return new OfficeHoursMessage(json);
  }

  if (isTypicalResponseTimeMessage(json)) {
    return new TypicalResponseTimeMessage(json);
  }

  if (isFilteredChangeMessage(json)) {
    return new FilteredChangeMessage(json);
  }

  if (isThreadStatusUpdateMessage(json)) {
    return new ThreadStatusUpdateMessage(json);
  }

  if (isReadThreadMessage(json)) {
    return new ReadThreadMessage(json);
  }

  if (isInboxUpdateMessage(json)) {
    return new InboxUpdateMessage(json);
  }

  if (isAgentAvailabilityMessage(json)) {
    return new AgentAvailabilityMessage(json);
  }

  if (isAssignmentUpdateMessage(json)) {
    return new AssignmentUpdateMessage(json);
  }

  if (isFeedbackSurveyMessage(json)) {
    return new FeedbackSurveyMessage(json);
  }

  return json;
}