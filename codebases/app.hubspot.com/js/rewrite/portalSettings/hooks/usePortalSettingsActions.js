'use es6';

import { useCallback } from 'react';
import update from 'transmute/update';
import set from 'transmute/set';
import get from 'transmute/get';
import { useApolloClient } from '@apollo/client';
import { PortalSettingsQuery } from './usePortalSettings';
import { getPortalSettingsToFetch } from '../constants/PortalSettingsKeys';
import { writePortalSetting } from '../api/portalSettingsAPI';
import invariant from 'react-utils/invariant';
export var usePortalSettingsActions = function usePortalSettingsActions() {
  var client = useApolloClient(); // HACK: If we had a graphql mutation to set portal settings we could discard
  // all of this code and replace it with a simple "useMutation".

  var writeSettingToApolloCache = useCallback(function (key, value) {
    var commonQueryValues = {
      query: PortalSettingsQuery,
      variables: {
        portalSettingsKeys: getPortalSettingsToFetch()
      }
    }; // We must read the data directly from the cache to avoid stale closures when
    // multiple settings are saved at once (i.e board card settings)

    var rawSettings = get('hubSettingValues', client.readQuery(commonQueryValues));
    var keyIndex = rawSettings ? rawSettings.findIndex(function (_ref) {
      var name = _ref.name;
      return key === name;
    }) : -1;
    invariant(keyIndex !== -1, 'usePortalSettingsActions: You must fetch a setting before updating it. Please add %s to PortalSettingsKeys.js.', key);
    client.writeQuery({
      query: PortalSettingsQuery,
      variables: {
        portalSettingsKeys: getPortalSettingsToFetch()
      },
      data: {
        hubSettingValues: update(keyIndex, function (setting) {
          return set('value', JSON.stringify(value), setting);
        }, rawSettings)
      }
    });
  }, [client]);
  var setPortalSetting = useCallback(function (key, value) {
    // TODO: Get the BE to give us mutations for this so we don't need to manually
    // write to the cache.
    return writePortalSetting(key, value).then(function () {
      writeSettingToApolloCache(key, value);
    });
  }, [writeSettingToApolloCache]);
  return {
    setPortalSetting: setPortalSetting
  };
};