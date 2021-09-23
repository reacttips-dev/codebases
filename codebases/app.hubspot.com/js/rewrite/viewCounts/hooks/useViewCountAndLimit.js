'use es6';

import { useSelector } from 'react-redux';
import { getViewCountForCurrentObjectType, getViewCountLimit } from '../../viewCounts/selectors/viewCountsSelectors';
export var useViewCountAndLimit = function useViewCountAndLimit() {
  var limit = useSelector(getViewCountLimit);
  var count = useSelector(getViewCountForCurrentObjectType);
  return {
    count: count,
    limit: limit
  };
};