'use es6';

import { createSelector } from 'reselect';
import { createTruthySelector } from 'truthy-selector';
import { getInitialQuery } from './initialQuery';
import { ACCOUNT_TYPES, NETWORKS_AVAILABLE_FOR_POST_TARGETING, MANAGE_BETA_GATE, COMPARE_BETA_GATE } from '../../lib/constants';
export var getGates = function getGates(state) {
  return state.gates;
};
export var getIsUngatedForAnyGates = createSelector([getGates, function (state, props) {
  return props.gates;
}], function (gates, gatesToCheck) {
  return gates.intersect(gatesToCheck).size > 0;
});
export var getInsightStatsEnabled = createTruthySelector([getInitialQuery], function (initialQuery) {
  return Boolean(initialQuery.showInsights);
});
export var getTotalConnectedChannels = function getTotalConnectedChannels(state) {
  return state.totalConnectedChannels;
};
export var getConnectedChannelsLimit = function getConnectedChannelsLimit(state) {
  return state.portal.limits['social-connected-channels'];
};
export var portalIsTrial = createSelector([getConnectedChannelsLimit], function (connectedChannelsLimit) {
  return connectedChannelsLimit <= 20;
});
export var getIsUngatedForManageBeta = createTruthySelector([getGates], function (gates) {
  return gates.has(MANAGE_BETA_GATE);
});
export var getIsUngatedForCompareBeta = createTruthySelector([getGates], function (gates) {
  return gates.has(COMPARE_BETA_GATE);
});
export var makeGetPostTargetingEnabledForNetwork = createSelector(function () {
  return function (network) {
    if (!NETWORKS_AVAILABLE_FOR_POST_TARGETING.includes(network)) {
      return false;
    }

    if (network === ACCOUNT_TYPES.facebook) {
      return true;
    }

    return false;
  };
});