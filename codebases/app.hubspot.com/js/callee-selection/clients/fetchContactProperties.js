'use es6';

import { logCallingError } from 'calling-error-reporting/report/error';
import http from 'hub-http/clients/apiClient';
export function fetchContactProperties() {
  return http.get("properties/v4/groups/0-1/named/contactinformation?includeProperties=true").catch(function (error) {
    logCallingError({
      errorMessage: 'Contact Information Properties request failed',
      extraData: {
        error: error
      },
      tags: {
        requestName: 'properties/v4/groups/0-1/named/contactinformation?includeProperties=true'
      }
    });
    return {};
  });
}