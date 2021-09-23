'use es6';

import { prefix } from './constants';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { getInactiveIsTurnedOnKey, getInactiveLimitKey, getInactiveLimitUnitKey } from './get';
export var logSave = function logSave(_ref) {
  var objectType = _ref.objectType,
      state = _ref.state;
  var newPreferences = state.get(prefix);
  CrmLogger.log('indexUsage', {
    action: 'use card preferences',
    subAction: 'save new inactive cards',
    objectType: objectType,
    inactiveCardsIsTurnedOn: newPreferences.get('ISTURNEDON'),
    inactiveCardsUnit: newPreferences.get('UNIT'),
    inactiveCardsValue: newPreferences.get('VALUE')
  });
};
export var save = function save(_ref2) {
  var objectType = _ref2.objectType,
      state = _ref2.state,
      storeContents = _ref2.storeContents,
      setUserSettingAction = _ref2.setUserSettingAction;
  var newPreferences = state.get(prefix);
  var oldPreferences = storeContents.get(prefix);
  return function () {
    if (newPreferences.equals(oldPreferences)) {
      return Promise.resolve();
    }

    var saveIsTurnedOn = setUserSettingAction(getInactiveIsTurnedOnKey(objectType), newPreferences.get('ISTURNEDON').toString());
    var saveValue = setUserSettingAction(getInactiveLimitKey(objectType), newPreferences.get('VALUE'));
    var saveUnit = setUserSettingAction(getInactiveLimitUnitKey(objectType), newPreferences.get('UNIT'));
    logSave({
      objectType: objectType,
      state: state,
      storeContents: storeContents
    });
    return Promise.all([saveIsTurnedOn, saveValue, saveUnit]);
  };
};