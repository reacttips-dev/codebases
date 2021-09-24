'use es6';

import { useSelector } from 'react-redux';
import isEmpty from 'transmute/isEmpty';
import { getPinnedViewIds } from '../selectors/pinnedViewsSelectors';
import { ALL, MY, UNASSIGNED } from '../../views/constants/DefaultViews';
export var defaultPinnedViews = [ALL, MY, UNASSIGNED];
export var usePinnedViewIds = function usePinnedViewIds() {
  var pinnedViewsFromState = useSelector(getPinnedViewIds);

  if (!pinnedViewsFromState || isEmpty(pinnedViewsFromState)) {
    return defaultPinnedViews;
  }

  return pinnedViewsFromState;
};