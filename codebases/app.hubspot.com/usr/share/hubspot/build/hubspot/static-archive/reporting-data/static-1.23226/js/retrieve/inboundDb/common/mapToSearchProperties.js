'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _MAP_TO_SEARCH_PROPER;

import { fromJS } from 'immutable';
import * as dataTypes from '../../../constants/dataTypes';
import { dataTypeToEngagementType } from './engagement-types';
var MAP_TO_SEARCH_PROPERTIES = (_MAP_TO_SEARCH_PROPER = {}, _defineProperty(_MAP_TO_SEARCH_PROPER, dataTypes.CONTACTS, {
  associatedcompanyid: 'hs_associated_company'
}), _defineProperty(_MAP_TO_SEARCH_PROPER, dataTypes.DEALS, {
  'associations.company': 'hs_associated_company',
  'associations.contact': 'hs_associated_contacts'
}), _defineProperty(_MAP_TO_SEARCH_PROPER, dataTypes.ENGAGEMENT, {
  'associations.contact': 'hs_associated_contacts',
  'associations.company': 'hs_associated_company',
  'call.status': 'hs_call_status',
  'call.durationMilliseconds': 'hs_call_duration',
  'call.disposition': 'hs_call_disposition',
  'call.body': 'hs_call_body',
  'conversationSession.visitorStartTime': 'hs_conversation_session_visitor_start_time',
  'conversationSession.visitorEndTime': 'hs_conversation_session_visitor_end_time',
  'conversationSession.visitorWaitTimeMilliseconds': 'hs_conversation_session_visitor_wait_time',
  'conversationSession.sessionDurationMilliseconds': 'hs_conversation_session_duration',
  'conversationSession.agentJoinTime': 'hs_conversation_session_agent_join_time',
  'conversationSession.numVisitorMessages': 'hs_conversation_session_num_visitor_messages',
  'conversationSession.numAgentMessages': 'hs_conversation_session_num_agent_messages',
  'conversationSession.online': 'hs_conversation_session_online',
  'conversationSession.isBot': 'hs_conversation_session_is_bot',
  'conversationSession.fullUrl': 'hs_conversation_session_url',
  'conversationSession.conversationSource': 'hs_conversation_session_source',
  'conversationSession.threadId': 'hs_conversation_session_thread_id',
  'conversationSession.sessionClosedAt': 'hs_conversation_session_session_closed_at',
  'conversationSession.agentResponseTimeMilliseconds': 'hs_conversation_session_agent_response_time',
  'email.subject': 'hs_email_subject',
  'email.trackerKey': 'hs_email_tracker_key',
  'email.messageId': 'hs_email_message_id',
  'email.threadId': 'hs_email_thread_id',
  'email.status': 'hs_email_status',
  'email.sentVia': 'hs_email_sent_via',
  'email.html': 'hs_email_html',
  'email.text': 'hs_email_text',
  'engagement.timestamp': 'hs_timestamp',
  'engagement.createdAt': 'hs_createdate',
  'engagement.ownerId': 'hubspot_owner_id',
  'engagement.createdBy': 'hs_created_by',
  'engagement.lastUpdated': 'hs_lastmodifieddate',
  'engagement.modifiedBy': 'hs_modified_by',
  'engagement.type': 'hs_engagement_type',
  'engagement.teamId': 'hubspot_team_id',
  'engagement.activityType': 'hs_activity_type',
  'engagement.source': 'hs_engagement_source',
  'task.status': 'hs_task_status',
  'task.subject': 'hs_task_subject',
  'task.type': 'hs_task_type',
  'task.taskType': 'hs_task_type',
  'feedbackSubmission.rating': 'hs_feedback_submission_rating',
  'feedbackSubmission.formType': 'hs_feedback_submission_form_type',
  'feedbackSubmission.formGuid': 'hs_feedback_submission_form_guid',
  'feedbackSubmission.followUp': 'hs_feedback_submission_follow_up',
  'feedbackSubmission.formChannel': 'hs_feedback_submission_form_channel',
  'feedbackSubmission.responseGroup': 'hs_feedback_submission_response_group',
  'meeting.body': 'hs_meeting_body',
  'meeting.title': 'hs_meeting_title',
  'meeting.startTime': 'hs_meeting_start_time',
  'meeting.source': 'hs_meeting_source',
  'meeting.meetingOutcome': 'hs_meeting_outcome',
  'note.body': 'hs_note_body',
  'task.body': 'hs_task_body',
  'task.completionDate': 'hs_task_completion_date',
  'engagement.html': 'hs_body_preview_html',
  'email.headers': 'hs_email_headers',
  'publishingTask.state': 'hs_publishing_task_state',
  'publishingTask.campaignGuid': 'hs_publishing_task_campaign_guid',
  'publishingTask.category': 'hs_publishing_task_category'
}), _MAP_TO_SEARCH_PROPER);
export var ENGAGEMENT_TYPE_DETAILS_PROPERTY_MAP = {
  EMAIL: ['hs_email_subject'],
  CALL: ['hs_call_body'],
  MEETING: ['hs_meeting_title', 'hs_meeting_body'],
  TASK: ['hs_task_subject'],
  NOTE: ['hs_note_body'],
  INCOMING_EMAIL: ['hs_email_subject'],
  FORWARDED_EMAIL: ['hs_email_subject'],
  PUBLISHING_TASK: ['hs_publishing_task_name']
};
var engagementDetailProperties = fromJS(ENGAGEMENT_TYPE_DETAILS_PROPERTY_MAP).toList().flatten().toSet();
export var mapPropertyToSearchProperty = function mapPropertyToSearchProperty(property, dataType) {
  return MAP_TO_SEARCH_PROPERTIES[dataType] ? MAP_TO_SEARCH_PROPERTIES[dataType][property] || property : property;
};
export var convertToSearchProperties = function convertToSearchProperties(properties, dataType) {
  if (dataType === dataTypes.ENGAGEMENT || dataTypeToEngagementType.has(dataType)) {
    var mappedProperties = properties.map(function (property) {
      return MAP_TO_SEARCH_PROPERTIES[dataTypes.ENGAGEMENT][property] || property;
    });

    if (properties.includes('engagement.details')) {
      return mappedProperties.toSet().subtract(['engagement.details']).union(engagementDetailProperties).toList();
    }

    return mappedProperties;
  }

  return properties;
};
export var ENGAGEMENT_MAP_TO_SEARCH_PROPERTIES = MAP_TO_SEARCH_PROPERTIES[dataTypes.ENGAGEMENT];