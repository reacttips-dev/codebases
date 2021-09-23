'use es6';

import PortalIdParser from 'PortalIdParser';
import http from 'hub-http/clients/apiClient';
var portalId = PortalIdParser.get();
export var BASE_PATH = "hubs-settings/v1/hubs/" + portalId + "/settings";
export var writePortalSetting = function writePortalSetting(key, value) {
  return http.post(BASE_PATH, {
    data: {
      hubId: portalId,
      internal: false,
      key: key,
      value: value
    }
  });
};