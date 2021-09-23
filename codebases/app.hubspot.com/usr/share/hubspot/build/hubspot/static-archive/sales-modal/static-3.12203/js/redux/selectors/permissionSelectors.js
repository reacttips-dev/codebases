'use es6';

import { createSelector } from 'reselect';

var getSalesModalInterface = function getSalesModalInterface(state) {
  return state.salesModalInterface;
};

var getPortal = createSelector([getSalesModalInterface], function (salesModalInterface) {
  return salesModalInterface.portal;
});
var getUser = createSelector([getSalesModalInterface], function (salesModalInterface) {
  return salesModalInterface.user;
});
export var getGateMap = createSelector([getPortal], function (portal) {
  return portal.get('enabled_gates').reduce(function (acc, gate) {
    acc[gate] = true;
    return acc;
  }, {});
});
export var getScopeMap = createSelector([getUser], function (user) {
  return user.get('scopes').reduce(function (acc, scope) {
    acc[scope] = true;
    return acc;
  }, {});
});

var isUngatedFor = function isUngatedFor(gate) {
  return createSelector([getGateMap], function (gateMap) {
    return gateMap[gate] === true;
  });
};

var hasScopeFor = function hasScopeFor(scope) {
  return createSelector([getScopeMap], function (scopeMap) {
    return scopeMap[scope] === true;
  });
};

export var hasSequencesAccess = hasScopeFor('sequences-read-access');
export var canUseEnrollments = hasScopeFor('sequences-enrollments-write-access');
export var hasHigherTemplatesLimit = hasScopeFor('templates-read-access');
export var hasHigherDocumentsLimit = hasScopeFor('documents-read-access');
export var hasOneToOneVideoAccess = hasScopeFor('one-to-one-video');
export var hasMaxSequencesSendLimit = hasScopeFor('sequences-max-email-send-limit');
export var isUngatedForMissingTokenTransformer = isUngatedFor('Sequences:MissingTokenTransformer');