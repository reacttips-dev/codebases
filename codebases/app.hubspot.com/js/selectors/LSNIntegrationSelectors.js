'use es6';

import { createSelector } from 'reselect';
export var getLSNIntegration = function getLSNIntegration(state) {
  return state.LSNIntegration;
};
export var hasConnectedLSNIntegration = createSelector(getLSNIntegration, function (integrationState) {
  return integrationState && integrationState.get('connected');
});
export var isFetchingLSNIntegration = createSelector(getLSNIntegration, function (integrationState) {
  return integrationState && integrationState.get('loading');
});