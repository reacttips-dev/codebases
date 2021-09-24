'use es6';

import http from 'hub-http/clients/apiClient';
import { getFullUrl } from 'hubspot-url-utils';
var cachedResult = null;
export var fetchOwners = function fetchOwners() {
  if (cachedResult !== null) {
    return cachedResult;
  }

  cachedResult = http.get(getFullUrl('api') + "/monetization-service/v2/owner");
  return cachedResult;
};