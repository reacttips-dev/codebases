'use es6';

import _toConsumableArray from "@babel/runtime/helpers/esm/toConsumableArray";
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useSelectedObjectTypeId } from '../../../objectTypeIdContext/hooks/useSelectedObjectTypeId';
import { setRecentlyUsedPropertiesAction } from '../actions/recentlyUsedPropertiesActions';
import { useRecentlyUsedPropertiesValue } from './useRecentlyUsedPropertiesValue';
export var useRecentlyUsedPropertiesActions = function useRecentlyUsedPropertiesActions() {
  var dispatch = useDispatch();
  var objectTypeId = useSelectedObjectTypeId();
  var value = useRecentlyUsedPropertiesValue();
  var onPropertyUsed = useCallback(function (name) {
    dispatch(setRecentlyUsedPropertiesAction(objectTypeId, [{
      timestamp: Date.now(),
      name: name
    }].concat(_toConsumableArray(value)).slice(0, 50)));
  }, [dispatch, objectTypeId, value]);
  return {
    onPropertyUsed: onPropertyUsed
  };
};