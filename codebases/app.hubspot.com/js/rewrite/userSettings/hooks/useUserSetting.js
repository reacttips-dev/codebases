'use es6';

import { getUserSettingsValue } from '../../utils/getSettingsValue';
import { useUserSettings } from './useUserSettings';
import memoizeOne from 'react-utils/memoizeOne';
import set from 'transmute/set';
export var mapGraphqlUserSettings = memoizeOne(function (hubSettingValues) {
  return hubSettingValues.reduce(function (settings, setting) {
    return set(setting.key, setting, settings);
  }, {});
});
export var useUserSetting = function useUserSetting(key) {
  var parse = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var graphqlSettings = useUserSettings();
  return getUserSettingsValue({
    key: key,
    settings: mapGraphqlUserSettings(graphqlSettings),
    parse: parse
  });
};