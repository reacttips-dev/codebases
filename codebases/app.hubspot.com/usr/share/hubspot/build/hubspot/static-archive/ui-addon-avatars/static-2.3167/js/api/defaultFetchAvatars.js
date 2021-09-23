'use es6';

import http from 'hub-http/clients/apiClient';
export default function defaultFetch(path, data) {
  return http.post(path, {
    data: data
  });
}