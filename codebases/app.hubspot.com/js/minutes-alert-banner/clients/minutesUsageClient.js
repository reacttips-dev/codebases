'use es6';

import http from 'hub-http/clients/apiClient';
export function requestFn() {
  return http.get("twilio/v1/usage");
}