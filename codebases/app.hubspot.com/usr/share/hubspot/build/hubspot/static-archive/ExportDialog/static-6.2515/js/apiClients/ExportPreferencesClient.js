'use es6';

import http from 'hub-http/clients/apiClient';
export var fetchPreferences = function fetchPreferences() {
  return http.get('notification-station/user-preferences/v1/preferences');
}; // This is needed to avoid jasmine's spyOn because it doesn't work so well with treeshaking
// More details: https://product.hubteam.com/docs/frontend/kb/concatenated-spies.html#true-solution

export var setFetchPreferencesForTesting = function setFetchPreferencesForTesting(f) {
  fetchPreferences = f;
};