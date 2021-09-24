'use es6';

import { createSelector } from 'reselect';
import { getOpenThreads } from './getOpenThreads';
export var getMostRecentOpenThread = createSelector([getOpenThreads], function (openThreads) {
  return openThreads ? openThreads.first() : undefined;
});