'use es6';

import PortalIdParser from 'PortalIdParser';
import { COMPANY_TYPE_ID, CONTACT_TYPE_ID, DEAL_TYPE_ID, TICKET_TYPE_ID } from 'customer-data-objects/constants/ObjectTypeIds';
import { getUserSettingsKeys } from '../constants/UserSettingsKeys';
var portalId = PortalIdParser.get();
export var getFavoriteColumnsUserSettingsKey = function getFavoriteColumnsUserSettingsKey(objectTypeId) {
  var settingsKeys = getUserSettingsKeys(objectTypeId, portalId);

  switch (objectTypeId) {
    case CONTACT_TYPE_ID:
      {
        return settingsKeys.CONTACTS_FAVORITE_COLUMNS;
      }

    case COMPANY_TYPE_ID:
      {
        return settingsKeys.COMPANIES_FAVORITE_COLUMNS;
      }

    case DEAL_TYPE_ID:
      {
        return settingsKeys.DEALS_FAVORITE_COLUMNS;
      }

    case TICKET_TYPE_ID:
      {
        return settingsKeys.TICKETS_FAVORITE_COLUMNS;
      }

    default:
      {
        return settingsKeys.GENERIC_FAVORITE_COLUMNS;
      }
  }
};