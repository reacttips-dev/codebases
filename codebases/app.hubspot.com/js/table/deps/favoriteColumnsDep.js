'use es6';

import PortalIdParser from 'PortalIdParser';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import { ResultRecord } from '../../utils/ResultRecord';
export var getFavoriteSettingsKey = function getFavoriteSettingsKey(objectTypeId) {
  return "CRM:" + objectTypeId + ":FavoriteColumns:" + PortalIdParser.get();
};
export var favoriteColumnsDep = {
  stores: [UserSettingsStore],
  deref: function deref(_ref) {
    var objectTypeId = _ref.objectTypeId;
    var data = UserSettingsStore.get(getFavoriteSettingsKey(objectTypeId));
    return ResultRecord.from({
      data: data
    });
  }
};