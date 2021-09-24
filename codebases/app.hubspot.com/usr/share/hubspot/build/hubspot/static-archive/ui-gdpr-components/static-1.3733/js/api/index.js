'use es6';

import http from 'hub-http/clients/apiClient';
var defaultOptions = {
  timeout: [30000],
  retries: 2
};
export var getSubscriptionTypes = function getSubscriptionTypes() {
  var hideInternal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return http.get('email/v1/subscriptions/definitions', Object.assign({}, defaultOptions, {
    query: {
      includeInternal: !hideInternal
    }
  }));
};
export var getBrands = function getBrands() {
  return http.get("/cos-domains/v1/brands", defaultOptions);
};
export var getSubscriptionGroups = function getSubscriptionGroups() {
  var includeInactive = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return http.get('/subscriptions/v1/preferences-group/all/with-permissions', Object.assign({}, defaultOptions, {
    query: {
      includeInactive: includeInactive
    }
  }));
};
export var getProcessOptions = function getProcessOptions() {
  return http.get('email/v2/subscriptions/categoriesAndChannels', defaultOptions);
};
export var getPortalSettings = function getPortalSettings() {
  return http.get('hubs-settings/v1/settings', defaultOptions);
};
export var getGdprPortalSetting = function getGdprPortalSetting() {
  return http.get('hubs-settings/v1/settings/GDPRComplianceEnabled', defaultOptions);
};
export var getSubscriptionHistory = function getSubscriptionHistory() {
  var recipient = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return http.get("subscriptions/v1/timeline/EMAIL/" + recipient + "/full-timeline", Object.assign({}, defaultOptions));
};