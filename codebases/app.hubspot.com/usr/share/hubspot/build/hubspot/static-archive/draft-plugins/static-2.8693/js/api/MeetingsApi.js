'use es6';

import http from 'hub-http/clients/apiClient';
var BASE_URI = 'meetings/v1/link';
export function fetchMeetingsLinks() {
  return http.get(BASE_URI, {
    query: {
      includeAssociated: true
    }
  });
}