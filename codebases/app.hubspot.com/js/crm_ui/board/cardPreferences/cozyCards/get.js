'use es6';

import { LOADING } from 'crm_data/flux/LoadingStatus';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import { useUserSetting } from '../../../../rewrite/userSettings/hooks/useUserSetting';
import { COZY_CARD_PREFERENCES_KEY, prefix } from './constants';
import { getDefaultState } from './defaultState';
import { fromJS } from 'immutable';
export var storesList = [UserSettingsStore];
export var deref = function deref() {
  var cozyPreferences = UserSettingsStore.get(COZY_CARD_PREFERENCES_KEY);
  return cozyPreferences;
};
/**
 * WARN: This hook exists solely to provide an IKEA-based method to access the cozy cards data.
 * **This hook can only be called in IKEA**. If called outside IKEA it will fail spectacularly.
 *
 * Pulls data out of redux to get the cozy cards setting, then formats it in a way that
 * CardPreferencesProvider expects.
 *
 * @returns {Object} An immutable map of the cozy cards data
 */

export var useGetCozyCardsValue = function useGetCozyCardsValue() {
  var settingsValue = useUserSetting(COZY_CARD_PREFERENCES_KEY);
  return fromJS(settingsValue || {});
};
export var get = function get(_ref) {
  var storeContents = _ref.storeContents,
      objectType = _ref.objectType;

  if (!storeContents) {
    return LOADING;
  }

  var cozyCardsStoreContents = storeContents.get(prefix);

  if (cozyCardsStoreContents && cozyCardsStoreContents.has(objectType)) {
    return cozyCardsStoreContents.get(objectType);
  }

  return getDefaultState(); // if no preferences exist for this objectType, return the default state
};