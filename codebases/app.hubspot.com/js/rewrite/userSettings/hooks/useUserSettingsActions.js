'use es6';

import { useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import { encodeSettingsValue } from '../utils/encodeSettingsValue';
import { UserSettingsQuery } from './useUserSettings';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { setUserSetting as setUserSettingApi } from '../api/userSettingsAPI';
import update from 'transmute/update';
import set from 'transmute/set';
import get from 'transmute/get';
import PortalIdParser from 'PortalIdParser';
import { getUserSettingsToFetch } from '../constants/UserSettingsKeys';
import invariant from 'react-utils/invariant';
var portalId = PortalIdParser.get();
export var useUserSettingsActions = function useUserSettingsActions() {
  var client = useApolloClient();
  var objectTypeId = useSelectedObjectTypeId(); // HACK: If we had a graphql mutation to set user settings we could discard
  // all of this code and replace it with a simple "useMutation".

  var writeSettingToApolloCache = useCallback(function (settingsKey, encodedValue) {
    var commonQueryValues = {
      query: UserSettingsQuery,
      variables: {
        userSettingsKeys: getUserSettingsToFetch(objectTypeId, portalId)
      }
    };
    var rawSettings = get('userAttributeValues', client.readQuery(commonQueryValues));
    var keyIndex = rawSettings ? rawSettings.findIndex(function (_ref) {
      var key = _ref.key;
      return key === settingsKey;
    }) : -1;
    invariant(keyIndex !== -1, 'useUserSettingsActions: You must fetch a setting before updating it. Please add %s to UserSettingsKeys.js.', settingsKey);
    client.writeQuery(Object.assign({}, commonQueryValues, {
      data: {
        userAttributeValues: update(keyIndex, function (setting) {
          return set('value', encodedValue, setting);
        }, rawSettings)
      }
    }));
  }, [client, objectTypeId]);
  var stageUserSetting = useCallback(function (key, value) {
    var encodedValue = encodeSettingsValue(value); // HACK: stageUserSettingAction returns a promise to match setUserSettingAction,
    // so we must do the same here. This can be refactored when the old redux code is
    // cleaned up.

    try {
      writeSettingToApolloCache(key, encodedValue);
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }, [writeSettingToApolloCache]);
  var setUserSetting = useCallback(function (key, value) {
    var encodedValue = encodeSettingsValue(value);
    return setUserSettingApi({
      key: key,
      value: encodedValue
    }).then(function () {
      return writeSettingToApolloCache(key, encodedValue);
    });
  }, [writeSettingToApolloCache]);
  return {
    setUserSetting: setUserSetting,
    stageUserSetting: stageUserSetting
  };
};