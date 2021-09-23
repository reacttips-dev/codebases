'use es6';

import { useSelector } from 'react-redux';
import { getCurrentViewId } from '../selectors/viewsSelectors';
import { useViewById } from './useViewById';
export var useCurrentView = function useCurrentView() {
  return useViewById(useSelector(getCurrentViewId));
};