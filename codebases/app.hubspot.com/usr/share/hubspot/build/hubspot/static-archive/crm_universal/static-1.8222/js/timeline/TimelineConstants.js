'use es6';

import keyMirror from 'react-utils/keyMirror';
import { List, Map as ImmutableMap } from 'immutable';
/**
 * DEPRECATION NOTICE: This file will be removed in favor of the crm_ui version once the Compact Timeline work
 * is complete. Until then, please make updates to both.
 *
 * Compact Timeline Epic: https://zenhub.hubteam.com/app/workspaces/crmpire-5b2aa8283bb90f6017cdf828/issues/hubspot/crm-issues/4659
 * crm_ui version: https://git.hubteam.com/HubSpot/CRM/blob/master/crm_ui/static/js/timeline/constants/TimelineConstants.js
 *
 */

var EVENT_TYPE_MAP = new ImmutableMap({
  addressChange: 'addressChange',
  BOUNCE: 'bounce',
  BOUNCED: 'bounce',
  CLICK: 'click',
  DELIVERED: 'delivered',
  DROPPED: 'dropped',
  SUPPRESSED: 'suppressed',
  EMAIL_CLICK: 'click',
  EMAIL_OPEN: 'open',
  EMAIL_REPLY: 'reply',
  EMAIL_TRACKER_CREATE: 'sent',
  FORWARD: 'forward',
  FAILED: 'failed',
  INCOMING_EMAIL: 'reply',
  OPEN: 'open',
  PRINT: 'print',
  SENT: 'sent',
  SENDING: 'sent',
  SPAMREPORT: 'spamReport',
  SCHEDULED: 'scheduled'
});
var EMAIL_EVENT_EVENT_TYPES = keyMirror({
  ADDRESS_LIST_BOMBED: null,
  BOUNCE: null,
  BOUNCED: null,
  CLICK: null,
  DELIVERED: null,
  DROPPED: null,
  FAILED: null,
  SUPPRESSED: null,
  MTA_DROPPED: null,
  OPEN: null,
  SPAMREPORT: null,
  STATUSCHANGE: null,
  UNBOUNCE: null,
  UNSUBSCRIBED: null,
  GLOBALLY_BLOCKED_RECIPIENT_ADDRESS: null,
  RECIPIENT_PREVIOUSLY_BOUNCED_GLOBALLY: null,
  GLOBALLY_BLOCKED_RECIPIENT_DOMAIN: null,
  RECIPIENT_PREVIOUSLY_BOUNCED_ON_PORTAL: null,
  PREVIOUSLY_MARKED_AS_SPAM: null,
  UNSUBSCRIBED_PORTAL: null,
  OTHER_SEND_REJECTED: null,
  PERMANENT_FAIL: null,
  UNSUBSCRIBED_PERSONAL: null,
  SEND_AS_PERMISSIONS_DENIED: null,
  RATE_LIMITED: null,
  RATE_LIMITED_BY_CLIENT: null,
  RATE_LIMITED_BY_PROVIDER: null,
  PREVIOUSLY_BOUNCED: null,
  PREVIOUS_SPAM: null,
  PREVIOUSLY_UNSUBSCRIBED_MESSAGE: null,
  PREVIOUSLY_UNSUBSCRIBED_MESSAGE_GDPR: null,
  PREVIOUSLY_UNSUBSCRIBED_PORTAL: null,
  PREVIOUSLY_UNSUBSCRIBED_PORTAL_GDPR: null,
  INVALID_TO_ADDRESS: null,
  INVALID_FROM_ADDRESS: null,
  BLOCKED_DOMAIN: null,
  BLOCKED_ADDRESS: null,
  EMAIL_UNCONFIRMED: null,
  CAMPAIGN_CANCELLED: null,
  MTA_IGNORE: null,
  PORTAL_OVER_LIMIT: null,
  PORTAL_SUSPENDED: null,
  CANCELLED_ABUSE: null,
  UNKNOWN_REASON: null,
  QUARANTINED_ADDRESS: null,
  GRAYMAIL_SUPPRESSED: null,
  RECIPIENT_FATIGUE_SUPPRESSED: null,
  REPLY: null
});
var EMAIL_SUBSCRIPTION_STATUS = keyMirror({
  SUBSCRIBED: null,
  UNSUBSCRIBED: null
});
var BATCH_REQUEST_SEPARATOR = '!';
var NON_INDEXED_MESSAGE_ID = 'NON_INDEXED_MESSAGE_ID'; // Used for not filtering out certain eventEmailSends

var SMTP_API_APP_ID = 22709;
var UNKNOWN_EVENT = 'unknownEmailEvent';
var SENT = EVENT_TYPE_MAP.get('SENT');
var DELIVERED = EVENT_TYPE_MAP.get('DELIVERED');
var OPEN = EVENT_TYPE_MAP.get('OPEN');
var CLICK = EVENT_TYPE_MAP.get('CLICK');
var REPLY = EVENT_TYPE_MAP.get('REPLY');
var EMAIL_EVENTS_PROGRESSION = new List([EVENT_TYPE_MAP.get('SCHEDULED'), EVENT_TYPE_MAP.get('SENT'), EVENT_TYPE_MAP.get('DELIVERED'), EVENT_TYPE_MAP.get('OPEN'), EVENT_TYPE_MAP.get('CLICK'), EVENT_TYPE_MAP.get('INCOMING_EMAIL'), EVENT_TYPE_MAP.get('BOUNCE'), EVENT_TYPE_MAP.get('DROPPED'), EVENT_TYPE_MAP.get('SUPPRESSED'), EVENT_TYPE_MAP.get('FAILED')]); // Sales email engagement types

var SALES_EMAIL_EVENT_TYPES = keyMirror({
  EMAIL: null,
  INCOMING_EMAIL: null
}); // Sidekick event types

var TRACKED_EVENT_TYPES = keyMirror({
  EMAIL_CLICK: null,
  EMAIL_OPEN: null,
  EMAIL_REPLY: null
}); // Marketing event types

var MARKETING_EVENT_TYPES = keyMirror({
  CLICK: null,
  OPEN: null,
  DELIVERED: null
}); // Used for fetching / filtering specific timeline events

var FAVORITE_ENGAGEMENT_TYPES = new ImmutableMap({
  CALL: 'ENGAGEMENTS_CALLS',
  EMAIL_OLD: 'ENGAGEMENTS_EMAILS',
  EMAIL: 'ENGAGEMENTS_EMAILS_TRIMMED',
  FORWARDED_EMAIL: 'ENGAGEMENTS_EMAILS_TRIMMED',
  INCOMING_EMAIL: 'ENGAGEMENTS_EMAILS_TRIMMED',
  MEETING: 'ENGAGEMENTS_MEETINGS',
  NOTE: 'ENGAGEMENTS_NOTES',
  TASK: 'ENGAGEMENTS_TASKS',
  FEEDBACK_SUBMISSION: 'ENGAGEMENTS_FEEDBACK_SUBMISSIONS',
  CONVERSATION_SESSION: 'ENGAGEMENTS_CONVERSATION_SESSIONS'
});
var SIDEKICK = 'SIDEKICK';
var BIDEN = 'BIDEN';
var EMAIL_EVENTS = 'EMAIL_EVENTS';
var EMAIL_SENDS = 'EMAIL_SENDS';
var EMAIL_UNBOUNCES = 'EMAIL_UNBOUNCES';
var EMAIL_OPTOUTS = 'EMAIL_OPTOUTS';
var INTEGRATION_EVENTS = 'INTEGRATION_EVENTS';
var LIST_MEMBERSHIPS = 'LIST_MEMBERSHIPS'; // These are for checking the 'etype'

var EVENT_EMAIL_SEND = 'eventEmailSend';
var EVENT_EMAIL_OPTOUTS = 'eventEmailOptOut';
var EVENT_ENGAGEMENT = 'eventEngagement';
var EVENT_INTEGRATIONS = 'eventIntegrations';
var EVENT_SIDEKICK = 'eventSidekick';
var EVENT_MONTH = 'eventMonth';
var TIMELINE_STATUSES = keyMirror({
  ERROR: null
});
var PATHS = ImmutableMap({
  ASSIGNED_OWNER: ['eventData', 'engagement', 'ownerId'],
  ASSOCIATED_COMPANIES: ['eventData', 'associations', 'companyIds'],
  ASSOCIATED_CONTACTS: ['eventData', 'associations', 'contactIds'],
  ASSOCIATED_DEALS: ['eventData', 'associations', 'dealIds'],
  BODY: ['eventData', 'metadata', 'body'],
  END_TIME: ['eventData', 'metadata', 'endTime'],
  HTML: ['eventData', 'metadata', 'html'],
  OWNERS: ['eventData', 'associations', 'ownerIds'],
  START_TIME: ['eventData', 'metadata', 'startTime'],
  SUBJECT: ['eventData', 'metadata', 'subject'],
  TIMESTAMP: ['eventData', 'engagement', 'timestamp'],
  TITLE: ['eventData', 'metadata', 'title'],
  ENGAGEMENT_TYPE: ['eventData', 'engagement', 'type']
});
var EMPTY_MONTH = new ImmutableMap({
  etype: 'eventMonth',
  hasEvents: false,
  id: null,
  timestamp: null
});
var UNITS_OF_TIME = new ImmutableMap({
  DAYS: 'days',
  MONTHS: 'months',
  WEEKS: 'weeks'
});
var ENGAGEMENT_TYPE_TO_I18N_KEY = {
  ENGAGEMENTS_ACTIVITY: 'activity',
  ENGAGEMENTS_NOTES: 'notes',
  ENGAGEMENTS_EMAILS_TRIMMED: 'emails',
  ENGAGEMENTS_CALLS: 'calls',
  ENGAGEMENTS_TASKS: 'tasks'
}; // Bodies with a length greater than this will show the expand / collapse button

var BODY_LENGTH_THRESHOLD = 1000;
export { BATCH_REQUEST_SEPARATOR, BIDEN, BODY_LENGTH_THRESHOLD, CLICK, DELIVERED, EMAIL_EVENT_EVENT_TYPES, EMAIL_EVENTS_PROGRESSION, EMAIL_EVENTS, EMAIL_OPTOUTS, EMAIL_SENDS, EMAIL_SUBSCRIPTION_STATUS, EMAIL_UNBOUNCES, EMPTY_MONTH, ENGAGEMENT_TYPE_TO_I18N_KEY, EVENT_EMAIL_OPTOUTS, EVENT_EMAIL_SEND, EVENT_ENGAGEMENT, EVENT_INTEGRATIONS, EVENT_MONTH, EVENT_SIDEKICK, EVENT_TYPE_MAP, FAVORITE_ENGAGEMENT_TYPES, INTEGRATION_EVENTS, LIST_MEMBERSHIPS, MARKETING_EVENT_TYPES, NON_INDEXED_MESSAGE_ID, OPEN, PATHS, REPLY, SALES_EMAIL_EVENT_TYPES, SENT, SIDEKICK, SMTP_API_APP_ID, TIMELINE_STATUSES, TRACKED_EVENT_TYPES, UNITS_OF_TIME, UNKNOWN_EVENT };