'use es6';

import { List } from 'immutable';
import { INITIAL_MESSAGE } from '../../initial-message/constants/messageType';
import { EMAIL_CAPTURE_PROMPT } from '../../email-capture-prompt/constants/messageTypes';
import { EMAIL_CAPTURE_RESPONSE } from '../../email-capture-response/constants/messageTypes';
import { OFFICE_HOURS } from '../../office-hours-message/constants/messageTypes';
import { FILTERED_CHANGE } from '../../filtered-change-message/constants/messageTypes';
import { THREAD_COMMENT } from '../../comment-message/constants/messageTypes';
import { CRM_OBJECT_WORKFLOW_EMAIL_SENT } from '../../crm-object-workflow-email-sent/constants/messageTypes';
import { CONTEXT_UPDATE } from '../../context-update/constants/messageTypes'; // TODO: CT-311

import { FAILED_TO_PUBLISH, ACTIVELY_PUBLISHING } from '../../unpublished-messages/constants/messageTypes';
import { CRM_OBJECT_LIFECYCLE_UPDATE } from '../../crm-object-lifecycle-update/constants/messageTypes';
import { COMMON_MESSAGE } from '../../common-message-format/constants/messageTypes';
import { THREAD_INBOX_UPDATED } from '../../inbox-update-message/constants/messageTypes';
import { TYPICAL_RESPONSE_TIME } from '../../typical-response-time/constants/messageTypes';
import { THREAD_STATUS_UPDATE } from '../../thread-status-update/constants/messageTypes';
import { ASSIGNMENT_UPDATE } from '../../assignment-update-message/constants/messageTypes';
export var AUTOMATED_CHAT_MESSAGE_TYPES = List([EMAIL_CAPTURE_PROMPT, EMAIL_CAPTURE_RESPONSE, OFFICE_HOURS, TYPICAL_RESPONSE_TIME]);
export var CONVERSATIONAL_MESSAGE_TYPES = List([INITIAL_MESSAGE, THREAD_COMMENT, COMMON_MESSAGE, ACTIVELY_PUBLISHING, FAILED_TO_PUBLISH]).concat(AUTOMATED_CHAT_MESSAGE_TYPES);
export var PRESENTATIONAL_MESSAGE_TYPES = List([CONTEXT_UPDATE, FILTERED_CHANGE, CRM_OBJECT_LIFECYCLE_UPDATE, CRM_OBJECT_WORKFLOW_EMAIL_SENT, THREAD_INBOX_UPDATED, THREAD_STATUS_UPDATE, ASSIGNMENT_UPDATE]).concat(CONVERSATIONAL_MESSAGE_TYPES);