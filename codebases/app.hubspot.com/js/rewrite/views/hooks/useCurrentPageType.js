'use es6';

import { useSelector } from 'react-redux';
import { getCurrentPageType } from '../selectors/viewsSelectors';
export var useCurrentPageType = function useCurrentPageType() {
  return useSelector(getCurrentPageType);
};