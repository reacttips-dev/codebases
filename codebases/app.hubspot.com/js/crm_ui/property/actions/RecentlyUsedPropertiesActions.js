'use es6';

import { Map as ImmutableMap, List } from 'immutable';
import { saveUserSetting } from 'crm_data/settings/UserSettingsActions';
import UserPortalSettingsKeys from 'crm_data/settings/UserPortalSettingsKeys';
var MAX_DATA_LENGTH = 50;
export function usedProperty(propertyRecord, recentlyUsedProperties, objectType) {
  if (!propertyRecord) {
    return;
  }

  if (!recentlyUsedProperties) {
    recentlyUsedProperties = List();
  }

  var newRecord = ImmutableMap({
    timestamp: Date.now(),
    name: propertyRecord.get('name')
  });

  if (recentlyUsedProperties.size >= MAX_DATA_LENGTH) {
    recentlyUsedProperties.pop();
  }

  var newRecentlyUsedProperties = recentlyUsedProperties.unshift(newRecord);
  saveUserSetting(UserPortalSettingsKeys["RECENTLY_USED_PROPERTIES_" + objectType], newRecentlyUsedProperties);
}