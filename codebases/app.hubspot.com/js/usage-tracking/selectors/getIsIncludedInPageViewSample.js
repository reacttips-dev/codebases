'use es6';

import getIn from 'transmute/getIn';
import { getUsageTracker } from '../usageTracker';
export var getIsIncludedInPageViewSample = function getIsIncludedInPageViewSample() {
  return getIn(['config', 'properties', 'isIncludedInPageViewSample'], getUsageTracker());
};