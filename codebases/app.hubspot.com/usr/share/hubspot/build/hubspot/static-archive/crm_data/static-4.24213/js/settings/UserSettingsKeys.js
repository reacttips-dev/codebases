/**
 * Keys for cross-portal settings.
 *
 * If you need a key that can differ across portals, see
 * crm_data/settings/UserPortalSettingsKeys.js
 *
 * Key should be defined in ABC order as...
 *
 *  export const KEY_NAME = 'key';
 */
'use es6';

import { COMPANY, CONTACT, DEAL, TICKET, TASK, VISIT } from 'customer-data-objects/constants/ObjectTypes';
import contactTypes from 'customer-data-objects/constants/CRMToContactsObjectTypes';
import PortalIdParser from 'PortalIdParser';

var _portalId = PortalIdParser.get();

var MAJOR_OBJECT_TYPES = [CONTACT, COMPANY, DEAL, TICKET, VISIT];
var BOARD_OBJECT_TYPES = [DEAL, TASK, TICKET];
var MAJOR_OBJECT_TYPE_IDS = [// Contact
'0-1', // Company
'0-2', // Deal
'0-3', // Ticket
'0-5'];
var NPS_SURVEY_OBJECT_TYPE = 'NPS_SURVEY';
var UserSettingsKeys = {
  COZY_CARD_PREFERENCES: ['CRM', 'Index', 'Board', 'CozyCardPreferences'],
  CLOSE_COUNT_IMPORT_KB_MODAL: ['closed-import-kb-modal'],
  DISMISSED_SHOW_ALL_EMAIL_REPLIES_ONBOARDING: ['dismissed-show-all-email-replies-onboarding'],
  DISMISSED_THREAD_EMAIL_REPLIES_ONBOARDING: ['dismissed-thread-email-replies-onboarding'],
  DISMISSED_EXPAND_COLLAPSE_TIMELINE_ONBOARDING: ['dismissed-expand-collapse-timeline-onboarding'],
  DONT_SHOW_CONFIRM_ACCOUNT_SWITCH: ['no-show-confirm-account-switch'],
  // todo - this isnt related to queues
  DONT_SHOW_FOLLOW_UP_TASK: ['Tasks', 'Queues', 'FollowUpTasks', 'hide'],
  HAS_CHECKED_SEQUENCE_STEP_SKIP_TASK: ['Tasks', 'Queues', 'has-checked-sequence-step-skip-task'],
  HAS_CHECKED_SEQUENCE_STEP_COMPLETE_TASK: ['Tasks', 'Queues', 'has-checked-sequence-step-complete-task'],
  EMAIL_COMMUNICATOR_TRACKING_TOOLTIP_SHOWN: ['has-viewed-email-communicator-tracking-tooltip'],
  // This setting really belongs in UserPortalSettingsKey, but the format is not correct
  GOOGLE_CALENDAR: ["integrations:google-calendar-v2:portal-" + _portalId],
  HAS_CHECKED_ASSOCIATION_DEAL_BOX_COMPANY: ['has-checked-association-deal-box-company'],
  HAS_CHECKED_ASSOCIATION_DEAL_BOX_CONTACT: ['has-checked-association-deal-box-contact'],
  HAS_CHECKED_ASSOCIATION_TICKET_BOX_COMPANY: ['has-checked-association-ticket-box-company'],
  HAS_CHECKED_ASSOCIATION_TICKET_BOX_CONTACT: ['has-checked-association-ticket-box-contact'],
  HAS_CLOSED_KILL_SENDGRID_ALERT: ['has-closed-kill-sendgrid-alert'],
  HAS_CLOSED_THREAD_REPLY_MESSAGE: ['has-closed-ticket-reply-message'],
  HAS_COMPLETED_INDEX_ONBOARDING: ['CRM', 'Index', 'Onboarding'],
  HAS_SEEN_COBJECT_ONBOARDING_SHEPHERD: ['CRM', 'Index', 'CobjectsOnboarding', _portalId, 'HasSeenShepherd'],
  HAS_SEEN_COBJECT_ONBOARDING_MODAL: ['CRM', 'Index', 'CobjectsOnboarding', _portalId, 'HasSeenModal'],
  HAS_COMPLETED_RECORD_ONBOARDING: ['CRM', 'ObjectRecord', 'Onboarding'],
  HAS_SEEN_ILS_LIST_MIGRATION_TOUR: ['CRM', 'Segments', _portalId, 'HasSeenMigrationTour'],
  HAS_SEEN_ILS_FOLDER_MIGRATION_TOUR: ['CRM', 'Segments', _portalId, 'HasSeenFolderTour'],
  HAS_SEEN_PINNED_NOTE: ['CRM', 'hasSeenNotePopover'],
  HAS_VIEWED_DEAL_EMPTY_STATE: ['Deals', 'viewed', 'emptyState'],
  HAS_VIEWED_DEALS_CHICKLET_ONBOARDING: ['Deals', 'viewed', 'chickletOnboarding'],
  HAS_VIEWED_DEALS_CELEBRATION_MODAL: ['Deals', 'viewed', 'celebration-modal'],
  HAS_VIEWED_DEAL_STAGE_PROPERTIES_ONBOARDING: ['CRM', 'DealStageProperties', 'Onboarding'],
  HAS_VIEWED_IMPORT_CHANGE_BANNER: ['has-viewed-import-change-banner'],
  HAS_VIEWED_IMPORT_UPDATE_SHEPHERD: ['has-viewed-import-update-shepherd'],
  HAS_VIEWED_INDEX_REDESIGN_FIRST_TIME_ALERT: ['has-viewed-index-redesign-first-time-alert'],
  HAS_VIEWED_LINE_ITEMS_REDESIGN_SHEPHERD: ['has-viewed-line-items-redesign-shepherd'],
  HAS_VIEWED_SMART_TASK_ONBOARDING: ['Tasks', 'SmartTasks', 'ViewedOnboarding'],
  HAS_VIEWED_TASKS_EMPTY_STATE: ['Tasks', 'viewed', 'emptyState'],
  HIDE_ASSOCIATE_PANEL_ONBOARDING_ALERT: ['hide-associate-panel-onboarding-alert'],
  HIDE_IMPORT_INFO_STEP: ['hide-import-info-step'],
  HIDE_LINE_ITEM_COLUMN_CONFIRM_MODAL: ['hide-line-item-column-confirm-modal'],
  HIDE_MEETINGS_PRO_TIP: ['hide-meetings-pro-tip'],
  HIDE_QUOTE_DRAFTED_MODAL: ['hide-quotes-drafted-modal'],
  HIDE_QUOTE_EXPIRED_MODAL: ['hide-quotes-expired-modal'],
  HIDE_QUOTES_SENDER_COMPANY_POPOVER: ['hide-quotes-sender-company-popover'],
  HIDE_PROPOSAL_CUSTOMIZATION_ALERT: ['hide-proposal-customization-alert'],
  IS_TIMELINE_EXPANDED_BY_DEFAULT: ['is-timeline-expanded-by-default'],
  JOB_TITLE: ['jobtitle'],
  LINKEDIN_SALES_NAVIGATOR: ['LINKEDIN_SALES_NAVIGATOR'],
  NPS_SETTINGS: [NPS_SURVEY_OBJECT_TYPE, 'nps_survey_completed'],
  PICKED_PORTAL_MODAL: ['PickedPortalModal'],
  QUOTES_TEMPLATE_PREFERENCE: ['quotes-template-preference'],
  THREE_COLUMN_PROFILES_VIEWED: ['3-column-profiles-viewed'],
  VIDEO_INTEGRATION_HAS_CREATED_VIDEO: ['video-integration-has-created-video'],
  VIEW_ALL_PROPERTIES_CLICKED: ['view-all-properties-clicked'],
  VIEWED_RECORDS_COUNT: ['viewed-records-count']
};
MAJOR_OBJECT_TYPES.forEach(function (objectType) {
  UserSettingsKeys["PROFILE_SIDEBAR_" + objectType] = [contactTypes[objectType], 'sidebar_settings'];
  UserSettingsKeys["PROFILE_SIDEBAR_" + objectType + "_ORDER"] = [contactTypes[objectType], 'sidebar_order'];
  UserSettingsKeys["PROFILE_RIGHT_SIDEBAR_" + objectType + "_ORDER"] = [contactTypes[objectType], 'right_sidebar_order'];
  UserSettingsKeys["PROFILE_LEFT_SIDEBAR_" + objectType + "_ORDER"] = [contactTypes[objectType], 'left_sidebar_order'];
}); // not used directly but added so we can fetch it automatically in SetupData

MAJOR_OBJECT_TYPE_IDS.forEach(function (objectTypeId) {
  UserSettingsKeys["SIDEBAR_COLLAPSE_STATE" + objectTypeId] = [objectTypeId, 'sidebar_settings'];
});
BOARD_OBJECT_TYPES.forEach(function (objectType) {
  UserSettingsKeys[objectType + "_VIEWTYPE_DEFAULT"] = ["" + objectType, 'viewtype', 'default'];
});
BOARD_OBJECT_TYPES.forEach(function (objectType) {
  UserSettingsKeys[objectType + "_INACTIVE_IS_TURNED_ON"] = ["" + objectType, 'board_inactive_is_turned_on'];
  UserSettingsKeys[objectType + "_INACTIVE_LIMIT"] = ["" + objectType, 'board_inactive_limit'];
  UserSettingsKeys[objectType + "_INACTIVE_LIMIT_UNIT"] = ["" + objectType, 'board_inactive_limit_unit'];
});
/* Formats like "Contacts:sidebar_settings" */

Object.keys(UserSettingsKeys).forEach(function (key) {
  var value = UserSettingsKeys[key];
  UserSettingsKeys[key] = "" + value.join(':');
});
export default UserSettingsKeys;