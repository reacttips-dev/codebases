'use es6';

import { STATUS } from '../../../properties/partial/status-options';
import normalize from './normalize';

var extractProperty = function extractProperty(type, path) {
  return function (obj) {
    var types = Array.isArray(type) ? type : [type];
    return types.includes(obj.getIn(['engagement', 'type'])) ? normalize(obj.getIn(path) || null) : '';
  };
};

export var getCommonExtractors = function getCommonExtractors() {
  return {
    'engagement.details': function engagementDetails(obj) {
      var metadata = obj.get('metadata');
      var type = obj.getIn(['engagement', 'type']);
      var detail = metadata.get('text') || metadata.get('body');

      if (['EMAIL', 'INCOMING_EMAIL', 'FORWARDED_EMAIL', 'TASK'].includes(type)) {
        detail = metadata.get('subject');
      } else if (type === 'MEETING' && metadata.has('title')) {
        detail = metadata.get('title');
      }

      return normalize(detail);
    }
  };
};
export var getCallExtractors = function getCallExtractors() {
  return {
    'call.status': extractProperty('CALL', ['metadata', 'status']),
    'call.durationMilliseconds': extractProperty('CALL', ['metadata', 'durationMilliseconds']),
    'call.disposition': extractProperty('CALL', ['metadata', 'disposition']),
    'call.body': extractProperty('CALL', ['metadata', 'body'])
  };
};
export var getConversationSessionExtractors = function getConversationSessionExtractors() {
  return {
    'conversationSession.visitorStartTime': extractProperty('CONVERSATION_SESSION', ['metadata', 'visitorStartTime']),
    'conversationSession.visitorEndTime': extractProperty('CONVERSATION_SESSION', ['metadata', 'visitorEndTime']),
    'conversationSession.visitorWaitTimeMilliseconds': extractProperty('CONVERSATION_SESSION', ['metadata', 'visitorWaitTimeMilliseconds']),
    'conversationSession.sessionDurationMilliseconds': extractProperty('CONVERSATION_SESSION', ['metadata', 'sessionDurationMilliseconds']),
    'conversationSession.agentJoinTime': extractProperty('CONVERSATION_SESSION', ['metadata', 'agentJoinTime']),
    'conversationSession.numVisitorMessages': extractProperty('CONVERSATION_SESSION', ['metadata', 'numVisitorMessages']),
    'conversationSession.numAgentMessages': extractProperty('CONVERSATION_SESSION', ['metadata', 'numAgentMessages']),
    'conversationSession.online': extractProperty('CONVERSATION_SESSION', ['metadata', 'online']),
    'conversationSession.isBot': extractProperty('CONVERSATION_SESSION', ['metadata', 'isBot']),
    'conversationSession.fullUrl': extractProperty('CONVERSATION_SESSION', ['metadata', 'fullUrl']),
    'conversationSession.conversationSource': extractProperty('CONVERSATION_SESSION', ['metadata', 'conversationSource']),
    'conversationSession.threadId': extractProperty('CONVERSATION_SESSION', ['metadata', 'threadId']),
    'conversationSession.sessionClosedAt': extractProperty('CONVERSATION_SESSION', ['metadata', 'sessionClosedAt']),
    'conversationSession.agentResponseTimeMilliseconds': extractProperty('CONVERSATION_SESSION', ['metadata', 'agentResponseTimeMilliseconds'])
  };
};
export var getFeedbackSubmissionExtractors = function getFeedbackSubmissionExtractors() {
  return {
    'feedbackSubmission.rating': extractProperty('FEEDBACK_SUBMISSION', ['metadata', 'rating']),
    'feedbackSubmission.formType': extractProperty('FEEDBACK_SUBMISSION', ['metadata', 'surveyType']),
    'feedbackSubmission.formGuid': extractProperty('FEEDBACK_SUBMISSION', ['metadata', 'formGuid']),
    'feedbackSubmission.followUp': extractProperty('FEEDBACK_SUBMISSION', ['metadata', 'followUp']),
    'feedbackSubmission.formChannel': extractProperty('FEEDBACK_SUBMISSION', ['metadata', 'surveyChannel']),
    'feedbackSubmission.responseGroup': extractProperty('FEEDBACK_SUBMISSION', ['metadata', 'responseGroup'])
  };
};
export var getNoteExtractors = function getNoteExtractors() {
  return {
    'note.body': extractProperty('NOTE', ['metadata', 'body'])
  };
};
export var getEmailExtractors = function getEmailExtractors() {
  var EMAIL_TYPES = ['EMAIL', 'INCOMING_EMAIL', 'FORWARDED_EMAIL'];
  return {
    'email.subject': extractProperty(EMAIL_TYPES, ['metadata', 'subject']),
    'email.html': extractProperty(EMAIL_TYPES, ['metadata', 'from', 'email', 'FORWARDED_EMAIL']),
    'email.text': extractProperty(EMAIL_TYPES, ['metadata', 'text']),
    'email.trackerKey': extractProperty(EMAIL_TYPES, ['metadata', 'trackerKey']),
    'email.messageId': extractProperty(EMAIL_TYPES, ['metadata', 'messageId']),
    'email.threadId': extractProperty(EMAIL_TYPES, ['metadata', 'threadId']),
    'email.status': extractProperty(EMAIL_TYPES, ['metadata', 'status']),
    'email.sentVia': extractProperty(EMAIL_TYPES, ['metadata', 'sentVia'])
  };
};
export var getMeetingExtractors = function getMeetingExtractors() {
  return {
    'meeting.body': extractProperty('MEETING', ['metadata', 'body']),
    'meeting.title': extractProperty('MEETING', ['metadata', 'title']),
    'meeting.startTime': extractProperty('MEETING', ['metadata', 'startTime'])
  };
};
export var getTaskExtractors = function getTaskExtractors() {
  return {
    'task.taskType': extractProperty('TASK', ['metadata', 'taskType']),
    'task.status': extractProperty('TASK', ['metadata', 'status']) || STATUS().NOT_STARTED,
    'task.subject': extractProperty('TASK', ['metadata', 'subject']),
    'task.body': extractProperty('TASK', ['metadata', 'body']),
    'task.completionDate': extractProperty('TASK', ['metadata', 'completionDate'])
  };
};