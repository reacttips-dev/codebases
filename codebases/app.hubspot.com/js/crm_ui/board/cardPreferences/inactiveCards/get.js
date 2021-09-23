'use es6';

import UserSettingsKeys from 'crm_data/settings/UserSettingsKeys';
import UserSettingsStore from 'crm_data/settings/UserSettingsStore';
import { useMemo } from 'react';
import { LOADING } from 'crm_data/flux/LoadingStatus';
import { isLoading, isResolved } from 'crm_data/flux/LoadingStatus';
import { Map as ImmutableMap } from 'immutable';
import { INACTIVE_LIMIT_UNITS, DEFAULT_INACTIVE_IS_TURNED_ON, DEFAULT_INACTIVE_LIMIT_VALUE, DEFAULT_INACTIVE_LIMIT_UNIT, prefix } from './constants';
import { useUserSetting } from '../../../../rewrite/userSettings/hooks/useUserSetting';
export var getInactiveIsTurnedOnKey = function getInactiveIsTurnedOnKey(objectType) {
  return UserSettingsKeys[objectType + "_INACTIVE_IS_TURNED_ON"] || objectType + ":board_inactive_is_turned_on";
};
export var getInactiveLimitKey = function getInactiveLimitKey(objectType) {
  return UserSettingsKeys[objectType + "_INACTIVE_LIMIT"] || objectType + ":board_inactive_limit";
};
export var getInactiveLimitUnitKey = function getInactiveLimitUnitKey(objectType) {
  return UserSettingsKeys[objectType + "_INACTIVE_LIMIT_UNIT"] || objectType + ":board_inactive_limit_unit";
};
export var storesList = [UserSettingsStore];
export var getInactiveCardsStateValue = function getInactiveCardsStateValue(_ref) {
  var isTurnedOn = _ref.isTurnedOn,
      value = _ref.value,
      unit = _ref.unit;
  var unitIsValid = unit === INACTIVE_LIMIT_UNITS.DAYS || unit === INACTIVE_LIMIT_UNITS.WEEKS;
  return ImmutableMap({
    VALUE: value && !isNaN(value) ? Number(value) : DEFAULT_INACTIVE_LIMIT_VALUE,
    UNIT: unitIsValid ? unit : DEFAULT_INACTIVE_LIMIT_UNIT,
    ISTURNEDON: isResolved(isTurnedOn) ? isTurnedOn === 'true' : DEFAULT_INACTIVE_IS_TURNED_ON
  });
};
export var deref = function deref(_ref2) {
  var objectType = _ref2.objectType;
  var isTurnedOn = UserSettingsStore.get(getInactiveIsTurnedOnKey(objectType));
  var value = UserSettingsStore.get(getInactiveLimitKey(objectType));
  var unit = UserSettingsStore.get(getInactiveLimitUnitKey(objectType));

  if (isLoading(isTurnedOn) || isLoading(value) || isLoading(unit)) {
    return ImmutableMap({
      VALUE: LOADING,
      UNIT: LOADING,
      ISTURNEDON: LOADING
    });
  }

  return getInactiveCardsStateValue({
    isTurnedOn: isTurnedOn,
    value: value,
    unit: unit
  });
};
/**
 * WARN: This hook exists solely to provide an IKEA-based method to access the inactive cards data.
 * **This hook can only be called in IKEA**. If called outside IKEA it will fail spectacularly.
 *
 * Pulls data out of redux for the three inactive cards settings keys for the current object
 * type and formats it in a way that CardPreferencesProvider expects.
 *
 * @param {String} objectType
 * @returns {Object} An immutable map of the inactive cards data containing VALUE, UNIT, and ISTURNEDON keys.
 */

export var useGetInactiveCardsValue = function useGetInactiveCardsValue(objectType) {
  var isTurnedOn = useUserSetting(getInactiveIsTurnedOnKey(objectType));
  var value = useUserSetting(getInactiveLimitKey(objectType));
  var unit = useUserSetting(getInactiveLimitUnitKey(objectType));
  return useMemo(function () {
    return getInactiveCardsStateValue({
      isTurnedOn: isTurnedOn,
      value: value,
      unit: unit
    });
  }, [isTurnedOn, unit, value]);
};
export var get = function get(_ref3) {
  var storeContents = _ref3.storeContents;

  if (!storeContents) {
    return LOADING;
  }

  return storeContents.get(prefix);
};