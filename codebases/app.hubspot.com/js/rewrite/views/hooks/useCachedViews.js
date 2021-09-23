'use es6';

import { useSelector } from 'react-redux';
import { getCachedViews } from '../selectors/viewsSelectors';
export var useCachedViews = function useCachedViews() {
  return useSelector(getCachedViews);
};