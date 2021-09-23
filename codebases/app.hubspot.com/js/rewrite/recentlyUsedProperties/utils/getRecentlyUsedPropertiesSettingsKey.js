'use es6';

import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import PortalIdParser from 'PortalIdParser';
import { getUserSettingsKeys } from '../../userSettings/constants/UserSettingsKeys';
var portalId = PortalIdParser.get();
export var getRecentlyUsedPropertiesSettingsKey = function getRecentlyUsedPropertiesSettingsKey(objectTypeId) {
  var settingsKeys = getUserSettingsKeys(objectTypeId, portalId);

  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      {
        return settingsKeys.CONTACTS_RECENTLY_USED_PROPERTIES;
      }

    case COMPANY_TYPE_ID:
      {
        return settingsKeys.COMPANIES_RECENTLY_USED_PROPERTIES;
      }

    case DEAL_TYPE_ID:
      {
        return settingsKeys.DEALS_RECENTLY_USED_PROPERTIES;
      }

    case TICKET_TYPE_ID:
      {
        return settingsKeys.TICKETS_RECENTLY_USED_PROPERTIES;
      }

    default:
      {
        return null;
      }
  }
};