'use es6';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { UNINITIALIZED } from '../../constants/RequestStatus';
import { getRecentlyUsedPropertiesStatus } from '../selectors/recentlyUsedPropertiesSelectors';
import { loadRecentlyUsedPropertiesAction } from '../actions/recentlyUsedPropertiesActions';
import { useUserSetting } from '../../userSettings/hooks/useUserSetting';
import { getRecentlyUsedPropertiesSettingsKey } from '../utils/getRecentlyUsedPropertiesSettingsKey';
export var useLoadRecentlyUsedProperties = function useLoadRecentlyUsedProperties() {
  var dispatch = useDispatch();
  var objectTypeId = useSelectedObjectTypeId();
  var status = useSelector(getRecentlyUsedPropertiesStatus);
  var recentlyUsedPropertiesKey = getRecentlyUsedPropertiesSettingsKey(objectTypeId);
  var settingsValue = useUserSetting(recentlyUsedPropertiesKey);
  useEffect(function () {
    if (status === UNINITIALIZED) {
      dispatch(loadRecentlyUsedPropertiesAction(objectTypeId, settingsValue));
    }
  }, [dispatch, status, objectTypeId, settingsValue]);
  return status;
};