'use es6';

import { useSelector } from 'react-redux';
import { getCurrentViewId } from '../selectors/viewsSelectors';
export var useCurrentViewId = function useCurrentViewId() {
  return String(useSelector(getCurrentViewId));
};