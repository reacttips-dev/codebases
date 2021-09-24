'use es6'; // WARNING: This file is shared between quick-fetch and standard code. Please do not use any imports as they will
// bloat the quick-fetch bundle size. Instead, we are enforcing correctness via testing.

var legacyObjectTypeIdToObjectType = {
  '0-1': 'CONTACT',
  '0-2': 'COMPANY',
  '0-3': 'DEAL',
  '0-5': 'TICKET'
};
export var getUserSettingsKeys = function getUserSettingsKeys(objectTypeId, portalId) {
  var objectType = legacyObjectTypeIdToObjectType[objectTypeId] || objectTypeId;
  return {
    CONTACTS_FAVORITE_COLUMNS: "Contacts:FavoriteColumns:" + portalId,
    COMPANIES_FAVORITE_COLUMNS: "Companies:FavoriteColumns:" + portalId,
    DEALS_FAVORITE_COLUMNS: "Deals:FavoriteColumns:" + portalId,
    TICKETS_FAVORITE_COLUMNS: "Tickets:FavoriteColumns:" + portalId,
    GENERIC_FAVORITE_COLUMNS: "CRM:" + objectTypeId + ":FavoriteColumns:" + portalId,
    CONTACTS_RECENTLY_USED_PROPERTIES: "Contacts:recently-used-properties:" + portalId,
    COMPANIES_RECENTLY_USED_PROPERTIES: "Companies:recently-used-properties:" + portalId,
    DEALS_RECENTLY_USED_PROPERTIES: "Deals:recently-used-properties:" + portalId,
    TICKETS_RECENTLY_USED_PROPERTIES: "Tickets:recently-used-properties:" + portalId,
    COZY_CARD_PREFERENCES: 'CRM:Index:Board:CozyCardPreferences',
    DEALS_VIEWED_CELEBRATION_MODAL: 'Deals:viewed:celebration-modal',
    GENERIC_BOARD_INACTIVE_ENABLED: objectType + ":board_inactive_is_turned_on",
    GENERIC_BOARD_INACTIVE_LIMIT: objectType + ":board_inactive_limit",
    GENERIC_BOARD_INACTIVE_LIMIT_UNIT: objectType + ":board_inactive_limit_unit",
    CRM_INDEX_ONBOARDING_SHEPHERD: "CRM:Index:CobjectsOnboarding:" + portalId + ":HasSeenShepherd",
    CRM_INDEX_ONBOARDING_MODAL: "CRM:Index:CobjectsOnboarding:" + portalId + ":HasSeenModal"
  };
};
export var getUserSettingsToFetch = function getUserSettingsToFetch(objectTypeId, portalId) {
  return Object.values(getUserSettingsKeys(objectTypeId, portalId));
};