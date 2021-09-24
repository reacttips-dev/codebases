'use es6';

import http from 'hub-http/clients/apiClient';
import PortalIdParser from 'PortalIdParser';
export var fetchNextChange = function fetchNextChange() {
  return http.get("account-and-billing/v1/marketable-contacts/next-change/" + PortalIdParser.get());
};