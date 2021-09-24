'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";

var _UserPortalSettingsKe;

import { COMPANY, CONTACT, DEAL, VISIT, TASK, TICKET } from 'customer-data-objects/constants/ObjectTypes';
import contactTypes from 'customer-data-objects/constants/CRMToContactsObjectTypes';
import PortalIdParser from 'PortalIdParser';

var _portalId = PortalIdParser.get();

var EMAIL_CLIENT_SETTINGS_OBJECT_TYPE = 'EMAIL_CLIENT_SETTINGS';
/**
 * Keys for users in a specific portal.
 * The portalId will be appended to the end of the key.
 *
 * If you need a key for cross-portal settings, see
 * crm_data/settings/UserSettingsKeys
 */

var UserPortalSettingsKeys = (_UserPortalSettingsKe = {
  EMAIL_CLIENT_SETTINGS: [EMAIL_CLIENT_SETTINGS_OBJECT_TYPE],
  EMAIL_TRACKING_SETTINGS: ['EMAIL_TRACKING_SETTINGS'],
  EMAIL_UNSUBSCRIBE_LINK_TYPE: ['hubspot', 'gdpr', 'unsubscribe-link'],
  ONBOARDING_SETTINGS: ['onboarding', 'onboarding-settings'],
  SALES_SEGMENTATION: ['onboarding', 'sales-segmentation'],
  SEGMENTS_FOLDERS_LAST_VIEWED: ['segments-folders-last-viewed'],
  SEGMENTS_DISMISSED_STALE_LIST_EXPLANATION: ['segments-folders-dismissed-stale-list-explanation'],
  SIGNEDUP_VIA_SPACESWORD: ['viaSpacesword'],
  TIP_POPOVER_SETTINGS: ['onboarding', 'onboarding-tip-popovers']
}, _defineProperty(_UserPortalSettingsKe, "COLUMN_FAVS_" + TASK, [contactTypes[TASK], 'FavoriteColumns_V2']), _defineProperty(_UserPortalSettingsKe, "COLUMN_FAVS_" + VISIT, [contactTypes[VISIT], 'FavoriteColumns']), _defineProperty(_UserPortalSettingsKe, "RECENTLY_USED_PROPERTIES_" + VISIT, [contactTypes[VISIT], 'recently-used-properties']), _defineProperty(_UserPortalSettingsKe, "HIDE_EMAIL_IMPORT_FOR_CONTACT", ['hide-email-import-for-contact']), _defineProperty(_UserPortalSettingsKe, "HIDE_EMAIL_IMPORT_FOR_ALL", ['hide-email-import-for-all']), _defineProperty(_UserPortalSettingsKe, "TASKS_SIDEBAR_COLLAPSED", ['Tasks', 'sidebar-collapsed']), _defineProperty(_UserPortalSettingsKe, "DISMISSED_RECORD_REDIRECT_FROM_TABLE_ONBOARDING", ['Tasks', 'dismissed-record-redirect-from-table-onboarding']), _defineProperty(_UserPortalSettingsKe, "DISMISSED_NEW_TASKS_TODAY_SHEPHERD", ['Tasks', 'dismissed-new-tasks-onboarding']), _UserPortalSettingsKe); // Settings keys that have are associated w/ all major object types

var MAJOR_OBJECT_TYPES = [CONTACT, COMPANY, DEAL, TICKET];
MAJOR_OBJECT_TYPES.forEach(function (objectType) {
  UserPortalSettingsKeys["TIMELINE_FAVS_" + objectType] = [contactTypes[objectType], 'FavoriteTimelineEvents'];
  UserPortalSettingsKeys["COLUMN_FAVS_" + objectType] = [contactTypes[objectType], 'FavoriteColumns'];
  UserPortalSettingsKeys["PROPERTY_EDITOR_HIDE_BLANK_" + objectType] = [contactTypes[objectType], 'property_editor_hide_blank'];
  UserPortalSettingsKeys["PROPERTY_EDITOR_OPEN_GROUPS_" + objectType] = [contactTypes[objectType], 'property_editor_open_groups'];
  UserPortalSettingsKeys["RECENTLY_USED_PROPERTIES_" + objectType] = [contactTypes[objectType], 'recently-used-properties'];
}); // Formats like "ONBOARDING:onboarding-settings:123456"

Object.keys(UserPortalSettingsKeys).forEach(function (key) {
  var value = UserPortalSettingsKeys[key];
  UserPortalSettingsKeys[key] = value.join(':') + ":" + _portalId;
});
export default UserPortalSettingsKeys;