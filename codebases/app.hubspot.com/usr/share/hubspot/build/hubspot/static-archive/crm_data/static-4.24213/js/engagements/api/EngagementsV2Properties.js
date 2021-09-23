'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _ImmutableMap;

import { EMAIL, CALL, MEETING, NOTE, TASK } from 'customer-data-objects/engagement/EngagementTypes';
import { TITLE, REMINDERS, TYPE, PRIORITY, SEND_DEFAULT_REMINDER, NOTES, STATUS, QUEUE_IDS, FOR_OBJECT_TYPE } from 'customer-data-objects/task/TaskPropertyNames';
import { Map as ImmutableMap } from 'immutable';
/**
 * Useful links:
 *
 * BE list of all properties for engagements: https://git.hubteam.com/HubSpot/CrmPropertyNames/blob/master/CrmPropertyNamesBase/src/main/java/com/hubspot/crm/properties/defaults/properties/DefaultEngagementProperty.java
 * BE properties (engagament v1 --> engaegment v2): https://git.hubteam.com/HubSpot/Engagements/blob/4d61ae3c431d0a11393a2179dd4750cf0232c26c/EngagementsData/src/main/java/com/hubspot/engagements/data/hbase/PropertyValueAdapter.java#L164
 * Permissions properties (only have to set owner): https://git.hubteam.com/HubSpot/CrmPropertyNames/blob/master/CrmPropertyNamesBase/src/main/java/com/hubspot/crm/properties/defaults/properties/StandardPermissionsProperty.java
 *
 */

export var PROPERTIES_BY_ENGAGEMENT_TYPE = ImmutableMap((_ImmutableMap = {}, _defineProperty(_ImmutableMap, CALL, [{
  propertyNameV1: 'activityType',
  propertyPathV1: ['engagement', 'activityType'],
  propertyNameV2: 'hs_activity_type'
}, {
  propertyNameV1: 'body',
  propertyPathV1: ['metadata', 'body'],
  propertyNameV2: 'hs_call_body'
}, {
  propertyNameV1: 'disposition',
  propertyPathV1: ['metadata', 'disposition'],
  propertyNameV2: 'hs_call_disposition'
}]), _defineProperty(_ImmutableMap, EMAIL, [{
  propertyNameV1: 'html',
  propertyPathV1: ['metadata', 'html'],
  propertyNameV2: 'hs_email_html'
}, {
  propertyNameV1: 'plainText',
  propertyPathV1: ['metadata', 'plainText'],
  propertyNameV2: 'hs_email_text'
}]), _defineProperty(_ImmutableMap, MEETING, [{
  propertyNameV1: 'activityType',
  propertyPathV1: ['engagement', 'activityType'],
  propertyNameV2: 'hs_activity_type'
}, {
  propertyNameV1: 'body',
  propertyPathV1: ['metadata', 'body'],
  propertyNameV2: 'hs_meeting_body'
}, {
  propertyNameV1: 'internalMeetingNotes',
  propertyPathV1: ['metadata', 'internalMeetingNotes'],
  propertyNameV2: 'hs_internal_meeting_notes'
}, {
  propertyNameV1: 'endTime',
  propertyPathV1: ['metadata', 'endTime'],
  propertyNameV2: 'hs_meeting_end_time'
}, {
  propertyNameV1: 'meetingOutcome',
  propertyPathV1: ['metadata', 'meetingOutcome'],
  propertyNameV2: 'hs_meeting_outcome'
}, {
  propertyNameV1: 'startTime',
  propertyPathV1: ['metadata', 'startTime'],
  propertyNameV2: 'hs_meeting_start_time'
}, {
  propertyNameV1: 'title',
  propertyPathV1: ['metadata', 'title'],
  propertyNameV2: 'hs_meeting_title'
}, {
  propertyNameV1: 'webConferenceMeetingId',
  propertyPathV1: ['metadata', 'webConferenceMeetingId'],
  propertyNameV2: 'hs_meeting_web_conference_meeting_id'
}]), _defineProperty(_ImmutableMap, NOTE, [{
  propertyNameV1: 'body',
  propertyPathV1: ['metadata', 'body'],
  propertyNameV2: 'hs_note_body'
}]), _defineProperty(_ImmutableMap, TASK, [{
  propertyNameV1: 'body',
  propertyPathV1: ['metadata', 'body'],
  propertyNameV2: NOTES
}, {
  propertyNameV1: 'forObjectType',
  propertyPathV1: ['metadata', 'forObjectType'],
  propertyNameV2: FOR_OBJECT_TYPE
}, {
  propertyNameV1: 'priority',
  propertyPathV1: ['metadata', 'priority'],
  propertyNameV2: PRIORITY
}, {
  propertyNameV1: 'reminders',
  propertyPathV1: ['metadata', 'reminders'],
  propertyNameV2: REMINDERS,
  parser: function parser(reminders) {
    return reminders ? reminders.join(';') : undefined;
  }
}, {
  propertyNameV1: 'setDefaultReminder',
  propertyPathV1: ['metadata', 'setDefaultReminder'],
  propertyNameV2: SEND_DEFAULT_REMINDER
}, {
  propertyNameV1: 'status',
  propertyPathV1: ['metadata', 'status'],
  propertyNameV2: STATUS
}, {
  propertyNameV1: 'subject',
  propertyPathV1: ['metadata', 'subject'],
  propertyNameV2: TITLE
}, {
  propertyNameV1: 'taskType',
  propertyPathV1: ['metadata', 'taskType'],
  propertyNameV2: TYPE
}, {
  propertyNameV1: 'queueMembershipIds',
  propertyPathV1: ['engagement', 'queueMembershipIds'],
  propertyNameV2: QUEUE_IDS
}]), _ImmutableMap));
export var COMMON_PROPERTIES = ImmutableMap({
  activityType: 'hs_activity_type',
  createdAt: 'hs_createdate',
  createdBy: 'hs_created_by',
  engagementType: 'hs_engagement_type',
  ownerId: 'hubspot_owner_id',
  ownerIds: 'hs_at_mentioned_owner_ids',
  timestamp: 'hs_timestamp',
  attachments: 'hs_attachment_ids'
});