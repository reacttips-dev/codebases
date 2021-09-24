'use es6';

import memoizeLast from 'transmute/memoizeLast';
import get from 'transmute/get';
import set from 'transmute/set';
import { hydrateFilterGroups } from './hydrateFilterGroupsAPI';
export var hydrateSearchQuery = memoizeLast(function (query) {
  var filterGroups = get('filterGroups', query);

  if (!Array.isArray(filterGroups) || filterGroups.length <= 0) {
    return Promise.resolve(query);
  }

  return hydrateFilterGroups(filterGroups).then(function (hydratedGroups) {
    return set('filterGroups', hydratedGroups, query);
  });
});