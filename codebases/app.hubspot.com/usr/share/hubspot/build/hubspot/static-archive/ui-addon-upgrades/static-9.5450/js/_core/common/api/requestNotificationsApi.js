'use es6';

import http from 'hub-http/clients/apiClient';
import { getFullUrl } from 'hubspot-url-utils';
var ENDPOINT = getFullUrl('api') + "/monetization-service/v3/request";
export var sendRequestAccessNotification = function sendRequestAccessNotification(apiName) {
  return http.post(ENDPOINT + "/access-owned", {
    data: {
      apiName: apiName
    }
  });
};
export var sendRequestAdditionalSeatsNotification = function sendRequestAdditionalSeatsNotification(apiName) {
  return http.post(ENDPOINT + "/additional-seats", {
    data: {
      apiName: apiName
    }
  });
};
export var sendRequestSKUNotification = function sendRequestSKUNotification(apiName) {
  return http.post(ENDPOINT + "/sku", {
    data: {
      apiName: apiName
    }
  });
};
export var sendRequestTrialNotification = function sendRequestTrialNotification(apiName) {
  return http.post(ENDPOINT + "/trial", {
    data: {
      apiName: apiName
    }
  });
};
export var sendRequestQuotePurchaseNotification = function sendRequestQuotePurchaseNotification(hub) {
  return http.post(ENDPOINT + "/quote-purchase", {
    data: {
      hub: hub
    }
  });
};