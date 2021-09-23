'use es6';

import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import _toArray from "@babel/runtime/helpers/esm/toArray";
import { COZY_CARD_PREFERENCES_KEY, prefix } from './constants';
import { CrmLogger } from 'customer-data-tracking/loggers';
import { Map as ImmutableMap } from 'immutable';

var validateNewPrefs = function validateNewPrefs(newPrefs) {
  var _newPrefs$keys = newPrefs.keys(),
      _newPrefs$keys2 = _toArray(_newPrefs$keys),
      keys = _newPrefs$keys2.slice(0);

  var allowedKeys = ['STYLE', 'BOTTOM_PANEL'];
  var notAllowedKeys = keys.filter(function (key) {
    return !allowedKeys.includes(key);
  });

  if (notAllowedKeys.length > 0) {
    throw new Error("cozyCards save called with invalid preference keys " + notAllowedKeys.join(','));
  }
};

export var logSave = function logSave(_ref) {
  var objectType = _ref.objectType,
      state = _ref.state;
  var newPreferences = state.get(prefix);
  var cozyCardsBottomPanel = newPreferences.get('BOTTOM_PANEL');
  var cozyCardsStyle = newPreferences.get('STYLE');
  CrmLogger.log('indexUsage', {
    action: 'use card preferences',
    subAction: 'save new cozy cards',
    objectType: objectType,
    cozyCardsStyle: cozyCardsStyle,
    cozyCardsBottomPanel: cozyCardsBottomPanel
  });
};
export var save = function save(_ref2) {
  var objectType = _ref2.objectType,
      state = _ref2.state,
      storeContents = _ref2.storeContents,
      setUserSettingAction = _ref2.setUserSettingAction;
  var preferencesForAllObjectTypes = storeContents.get(prefix) || ImmutableMap(); // || Map() to support if user has no preferences and store returns null

  var newPreferences = state.get(prefix);
  var newSettings = preferencesForAllObjectTypes.mergeDeep(_defineProperty({}, objectType, newPreferences));
  var oldPreferences = preferencesForAllObjectTypes.get(objectType);
  return function () {
    if (newPreferences.equals(oldPreferences)) {
      return Promise.resolve();
    }

    validateNewPrefs(newPreferences);
    logSave({
      objectType: objectType,
      state: state,
      storeContents: storeContents
    });
    return setUserSettingAction(COZY_CARD_PREFERENCES_KEY, newSettings);
  };
};