'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _messageTypeBuildersM;

import CrmObjectWorkflowEmailSent from '../../crm-object-workflow-email-sent/records/CrmObjectWorkflowEmailSent';
import { buildCommentMessage } from '../../comment-message/operators/buildCommentMessage';
import { buildCommonMessage } from '../../common-message-format/operators/buildCommonMessage';
import ContextUpdateMessage from '../../context-update/records/ContextUpdateMessage';
import CrmObjectLifecycleUpdate from '../../crm-object-lifecycle-update/records/CrmObjectLifecycleUpdate';
import { buildInitialMessage } from '../../initial-message/operators/buildInitialMessage';
import { getType } from '../../common-message-format/operators/commonMessageFormatGetters';
import { THREAD_COMMENT } from '../../comment-message/constants/messageTypes';
import { INITIAL_MESSAGE } from '../../initial-message/constants/messageType';
import { COMMON_MESSAGE } from '../../common-message-format/constants/messageTypes';
import { CRM_OBJECT_WORKFLOW_EMAIL_SENT } from '../../crm-object-workflow-email-sent/constants/messageTypes';
import { CONTEXT_UPDATE } from '../../context-update/constants/messageTypes';
import { CRM_OBJECT_LIFECYCLE_UPDATE } from '../../crm-object-lifecycle-update/constants/messageTypes';
import { THREAD_INBOX_UPDATED } from '../../inbox-update-message/constants/messageTypes';
import { EMAIL_CAPTURE_PROMPT } from '../../email-capture-prompt/constants/messageTypes';
import InboxUpdateMessage from '../../inbox-update-message/records/InboxUpdateMessage';
import EmailCapturePromptMessage from '../../email-capture-prompt/records/EmailCapturePromptMessage';
import { EMAIL_CAPTURE_RESPONSE } from '../../email-capture-response/constants/messageTypes';
import EmailCaptureResponseMessage from '../../email-capture-response/records/EmailCaptureResponseMessage';
import OfficeHoursMessage from '../../office-hours-message/records/OfficeHoursMessage';
import TypicalResponseTimeMessage from '../../typical-response-time/records/TypicalResponseTimeMessage';
import { OFFICE_HOURS } from '../../office-hours-message/constants/messageTypes';
import { TYPICAL_RESPONSE_TIME } from '../../typical-response-time/constants/messageTypes';
import FilteredChangeMessage from '../../filtered-change-message/records/FilteredChangeMessage';
import { FILTERED_CHANGE } from '../../filtered-change-message/constants/messageTypes';
import ThreadStatusUpdateMessage from '../../thread-status-update/records/ThreadStatusUpdateMessage';
import { THREAD_STATUS_UPDATE } from '../../thread-status-update/constants/messageTypes';
import { TYPING } from '../../typing-indicator/constants/messageTypes';
import TypingIndicatorMessage from '../../typing-indicator/records/TypingIndicatorMessage';
import AssignmentUpdateMessage from '../../assignment-update-message/records/AssignmentUpdateMessage';
import { ASSIGNMENT_UPDATE } from '../../assignment-update-message/constants/messageTypes';
import { FEEDBACK_SURVEY } from '../../feedback-survey-message/constants/messageTypes';
import FeedbackSurveyMessage from '../../feedback-survey-message/records/FeedbackSurveyMessage';
var messageTypeBuildersMap = (_messageTypeBuildersM = {}, _defineProperty(_messageTypeBuildersM, ASSIGNMENT_UPDATE, function (messageObject) {
  return new AssignmentUpdateMessage(messageObject);
}), _defineProperty(_messageTypeBuildersM, COMMON_MESSAGE, buildCommonMessage), _defineProperty(_messageTypeBuildersM, INITIAL_MESSAGE, buildInitialMessage), _defineProperty(_messageTypeBuildersM, CRM_OBJECT_LIFECYCLE_UPDATE, function (messageObject) {
  return new CrmObjectLifecycleUpdate(messageObject);
}), _defineProperty(_messageTypeBuildersM, CRM_OBJECT_WORKFLOW_EMAIL_SENT, function (messageObject) {
  return new CrmObjectWorkflowEmailSent(messageObject);
}), _defineProperty(_messageTypeBuildersM, THREAD_COMMENT, buildCommentMessage), _defineProperty(_messageTypeBuildersM, CONTEXT_UPDATE, function (messageObject) {
  return new ContextUpdateMessage(messageObject);
}), _defineProperty(_messageTypeBuildersM, THREAD_INBOX_UPDATED, function (messageObject) {
  return new InboxUpdateMessage(messageObject);
}), _defineProperty(_messageTypeBuildersM, EMAIL_CAPTURE_PROMPT, function (messageObject) {
  return new EmailCapturePromptMessage(messageObject);
}), _defineProperty(_messageTypeBuildersM, EMAIL_CAPTURE_RESPONSE, function (messageObject) {
  return new EmailCaptureResponseMessage(messageObject);
}), _defineProperty(_messageTypeBuildersM, OFFICE_HOURS, function (messageObject) {
  return new OfficeHoursMessage(messageObject);
}), _defineProperty(_messageTypeBuildersM, TYPICAL_RESPONSE_TIME, function (messageObject) {
  return new TypicalResponseTimeMessage(messageObject);
}), _defineProperty(_messageTypeBuildersM, FILTERED_CHANGE, function (messageObject) {
  return new FilteredChangeMessage(messageObject);
}), _defineProperty(_messageTypeBuildersM, THREAD_STATUS_UPDATE, function (messageObject) {
  return new ThreadStatusUpdateMessage(messageObject);
}), _defineProperty(_messageTypeBuildersM, TYPING, function (messageObject) {
  return new TypingIndicatorMessage(messageObject);
}), _defineProperty(_messageTypeBuildersM, FEEDBACK_SURVEY, function (messageObject) {
  return new FeedbackSurveyMessage(messageObject);
}), _messageTypeBuildersM);
export var buildMessageFromType = function buildMessageFromType(message) {
  var builder = messageTypeBuildersMap[getType(message)];

  if (builder) {
    return builder(message);
  }

  return message;
};