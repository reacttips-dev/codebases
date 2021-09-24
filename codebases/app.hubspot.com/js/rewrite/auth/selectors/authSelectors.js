'use es6';

import { createSelector } from 'reselect';
export var getAuthSlice = function getAuthSlice(state) {
  return state.auth;
};
export var getAuthAsJS = createSelector([getAuthSlice], function (slice) {
  return slice.toJS();
});
export var getAuthUser = createSelector([getAuthSlice], function (slice) {
  return slice.get('user');
});
export var getCurrentUserId = createSelector([getAuthUser], function (user) {
  return String(user.get('user_id'));
});
export var getCurrentUserTeamsAsJS = createSelector([getAuthUser], function (user) {
  return user.get('teams').toJS();
});
export var getGatesSet = createSelector([getAuthSlice], function (slice) {
  return slice.get('gates');
});
export var getHasAllGates = createSelector([getGatesSet], function (gatesSet) {
  return function () {
    for (var _len = arguments.length, gates = new Array(_len), _key = 0; _key < _len; _key++) {
      gates[_key] = arguments[_key];
    }

    return gates.every(function (gate) {
      return gatesSet.has(gate);
    });
  };
});
export var getGatesInLegacyFormat = createSelector([getGatesSet], function (gates) {
  return gates.toArray();
});
export var getScopesSet = createSelector([getAuthSlice], function (slice) {
  return slice.get('scopes');
});
export var getScopesInLegacyFormat = createSelector([getScopesSet], function (scopes) {
  return scopes.reduce(function (scopesMap, scope) {
    scopesMap[scope] = true;
    return scopesMap;
  }, {});
});