'use es6';

import { useSelector } from 'react-redux';
import { getRecentlyUsedProperties } from '../selectors/recentlyUsedPropertiesSelectors';
export var useRecentlyUsedPropertiesValue = function useRecentlyUsedPropertiesValue() {
  return useSelector(getRecentlyUsedProperties);
};