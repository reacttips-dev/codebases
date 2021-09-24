'use es6';

import get from 'transmute/get';
import { createSelector } from 'reselect';
export var getAuthFromState = get('auth');
export var getPortalFromState = createSelector([getAuthFromState], get('portal'));
export var getPortalIdFromState = createSelector([getPortalFromState], get('portal_id'));
export var getUserFromState = createSelector([getAuthFromState], get('user'));
export var getUserIdFromState = createSelector([getUserFromState], get('user_id'));
export var getUserEmailFromState = createSelector([getUserFromState], get('email'));
export var getGatesFromState = createSelector([getAuthFromState], get('gates'));
export var getScopesFromState = createSelector([getUserFromState], get('scopes'));
export var getTeamsFromState = createSelector([getUserFromState], get('teams'));

var getGateFromProps = function getGateFromProps(state, _ref) {
  var gate = _ref.gate;
  return gate;
};

export var isUngatedFor = createSelector([getGatesFromState, getGateFromProps], function (gates, gateToCheck) {
  return gates && gates.includes(gateToCheck);
});