'use es6';

import http from 'hub-http/clients/apiClient';
import PortalIdParser from 'PortalIdParser';
var BASE_URL = "email/v1/optin/portals/" + PortalIdParser.get() + "/settings-summary";
export var fetchDoubleOptInSetting = function fetchDoubleOptInSetting() {
  return http.get(BASE_URL);
};