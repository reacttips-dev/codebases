'use es6';

import { createSelector } from 'reselect';
import { getOpenThreads } from './getOpenThreads';
export var hasOpenThread = createSelector([getOpenThreads], function (openThreads) {
  return openThreads.size > 0;
});