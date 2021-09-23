'use es6';

import { getPortalSettingsValue } from '../../utils/getSettingsValue';
import { usePortalSettings } from './usePortalSettings';
import memoizeOne from 'react-utils/memoizeOne';
import set from 'transmute/set';
export var mapGraphqlPortalSettings = memoizeOne(function (hubSettingValues) {
  return hubSettingValues.reduce(function (settings, setting) {
    return set(setting.name, setting, settings);
  }, {});
});
export var usePortalSetting = function usePortalSetting(key) {
  var parse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var graphqlSettings = usePortalSettings();
  return getPortalSettingsValue({
    key: key,
    settings: mapGraphqlPortalSettings(graphqlSettings),
    parse: parse
  });
};