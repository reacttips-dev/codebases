'use es6';

import { createSelector } from 'reselect';

var getUsage = function getUsage(state) {
  return state.sequencesUsage;
};

var getCount = createSelector(getUsage, function (usage) {
  return usage && usage.count;
});
var getLimit = createSelector(getUsage, function (usage) {
  return usage && usage.limit;
});
export var getPortalIsAtLimit = createSelector([getLimit, getCount], function (limit, count) {
  if (!count) {
    return false;
  }

  return count >= limit;
});

var getTemplatesUsage = function getTemplatesUsage(state) {
  return state.templatesUsage;
};

export var getPortalIsAtTemplatesLimit = createSelector([getTemplatesUsage], function (templatesUsage) {
  if (!templatesUsage || templatesUsage.error) {
    return false;
  }

  return templatesUsage.currentUsage >= templatesUsage.limit;
});
export var getUserIsAtTemplatesLimit = createSelector([getTemplatesUsage], function (templatesUsage) {
  if (!templatesUsage || templatesUsage.error) {
    return false;
  }

  return templatesUsage.currentUsage >= templatesUsage.userLimit;
});