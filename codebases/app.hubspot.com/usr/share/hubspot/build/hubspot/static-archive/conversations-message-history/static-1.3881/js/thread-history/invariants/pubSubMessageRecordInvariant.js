'use es6';

import CommentMessage from '../../comment-message/records/CommentMessage';
import CommonMessage from '../../common-message-format/records/CommonMessage';
import ContextUpdateMessage from '../../context-update/records/ContextUpdateMessage';
import CrmObjectLifecycleUpdate from '../../crm-object-lifecycle-update/records/CrmObjectLifecycleUpdate';
import InitialMessage from '../../initial-message/records/InitialMessage';
import TypingIndicatorMessage from '../../typing-indicator/records/TypingIndicatorMessage';
import InboxUpdateMessage from '../../inbox-update-message/records/InboxUpdateMessage';
import EmailCapturePromptMessage from '../../email-capture-prompt/records/EmailCapturePromptMessage';
import EmailCaptureResponseMessage from '../../email-capture-response/records/EmailCaptureResponseMessage';
import OfficeHoursMessage from '../../office-hours-message/records/OfficeHoursMessage';
import TypicalResponseTimeMessage from '../../typical-response-time/records/TypicalResponseTimeMessage';
import FilteredChangeMessage from '../../filtered-change-message/records/FilteredChangeMessage';
import ThreadStatusUpdateMessage from '../../thread-status-update/records/ThreadStatusUpdateMessage';
import AssignmentUpdateMessage from '../../assignment-update-message/records/AssignmentUpdateMessage';
import { getRecordName } from '../../util/getRecordName';
import invariant from 'react-utils/invariant';
var supportedRecords = [CommonMessage, ContextUpdateMessage, CrmObjectLifecycleUpdate, CommentMessage, InitialMessage, TypingIndicatorMessage, InboxUpdateMessage, EmailCapturePromptMessage, EmailCaptureResponseMessage, OfficeHoursMessage, TypicalResponseTimeMessage, FilteredChangeMessage, ThreadStatusUpdateMessage, AssignmentUpdateMessage];
export var pubSubMessageRecordInvariant = function pubSubMessageRecordInvariant(message) {
  return invariant(supportedRecords.some(function (record) {
    return message instanceof record;
  }), "Expected message to be one of " + supportedRecords.map(getRecordName));
};