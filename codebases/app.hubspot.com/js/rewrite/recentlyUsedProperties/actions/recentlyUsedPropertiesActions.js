'use es6';

import { getSuperStoreValue } from '../../superstore/getSuperStoreValue';
import { setSuperStoreValue } from '../../superstore/setSuperStoreValue';
import { getRecentlyUsedPropertiesSuperStoreKey } from '../utils/getRecentlyUsedPropertiesSuperStoreKey';
import { RECENTLY_USED_PROPERTIES_LOAD_STARTED, RECENTLY_USED_PROPERTIES_LOAD_SUCCEEDED, RECENTLY_USED_PROPERTIES_LOAD_FAILED, RECENTLY_USED_PROPERTIES_SET_STARTED, RECENTLY_USED_PROPERTIES_SET_SUCCEEDED, RECENTLY_USED_PROPERTIES_SET_FAILED } from './recentlyUsedPropertiesActionTypes';

var setRecentlyUsedProperties = function setRecentlyUsedProperties(objectTypeId, value) {
  return setSuperStoreValue(getRecentlyUsedPropertiesSuperStoreKey(objectTypeId), value);
};

export var setRecentlyUsedPropertiesAction = function setRecentlyUsedPropertiesAction(objectTypeId) {
  var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  return function (dispatch) {
    dispatch({
      type: RECENTLY_USED_PROPERTIES_SET_STARTED,
      payload: {
        objectTypeId: objectTypeId,
        value: value
      }
    });
    return setRecentlyUsedProperties(objectTypeId, value).then(function () {
      dispatch({
        type: RECENTLY_USED_PROPERTIES_SET_SUCCEEDED,
        payload: {
          objectTypeId: objectTypeId,
          value: value
        }
      });
    }).catch(function () {
      dispatch({
        type: RECENTLY_USED_PROPERTIES_SET_FAILED,
        payload: {
          objectTypeId: objectTypeId,
          value: value
        }
      });
    });
  };
};
export var loadRecentlyUsedPropertiesAction = function loadRecentlyUsedPropertiesAction(objectTypeId, settingsValue) {
  return function (dispatch) {
    var key = getRecentlyUsedPropertiesSuperStoreKey(objectTypeId);
    dispatch({
      type: RECENTLY_USED_PROPERTIES_LOAD_STARTED,
      payload: {
        objectTypeId: objectTypeId
      }
    });
    return getSuperStoreValue(key).then(function (superStoreValue) {
      var shouldUseSettingsValue = !superStoreValue && settingsValue;
      var value = shouldUseSettingsValue ? settingsValue : superStoreValue;

      if (shouldUseSettingsValue) {
        setRecentlyUsedProperties(objectTypeId, value);
      }

      dispatch({
        type: RECENTLY_USED_PROPERTIES_LOAD_SUCCEEDED,
        payload: {
          objectTypeId: objectTypeId,
          value: value
        }
      });
    }).catch(function () {
      dispatch({
        type: RECENTLY_USED_PROPERTIES_LOAD_FAILED,
        payload: {
          objectTypeId: objectTypeId
        }
      });
    });
  };
};