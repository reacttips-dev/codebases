'use es6';

import http from 'hub-http/clients/apiClient';
export function getSignupType() {
  return http.get('hubs-settings/v1/settings?key=signup-type').then(function (response) {
    if (response && response.settings && response.settings[0] && response.settings[0].value) {
      return response.settings[0].value;
    }

    return null;
  });
}