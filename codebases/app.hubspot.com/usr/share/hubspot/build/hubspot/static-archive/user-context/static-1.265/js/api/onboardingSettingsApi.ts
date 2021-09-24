import http from 'hub-http/clients/apiClient';
import { getUrl } from '../utils/urlUtils';
var ONBOARDING_SETTINGS_PATH = "onboarding-settings/v1/settings";

var getUserInfoQuery = function getUserInfoQuery(userId, portalId) {
  var query = {};

  if (userId) {
    query.userId = userId;
  }

  if (portalId) {
    query.portalId = portalId;
  }

  return query;
};

export function fetchOnboardingSettings(userId, portalId) {
  var query = getUserInfoQuery(userId, portalId);
  return http.get(ONBOARDING_SETTINGS_PATH, {
    query: query
  });
}
export function patchOnboardingSettings(onboardingSettings, userId, portalId, options) {
  var query = getUserInfoQuery(userId, portalId);
  var onboardingSettingsRequestUrl = getUrl(ONBOARDING_SETTINGS_PATH, options);
  return http.patch(onboardingSettingsRequestUrl, {
    query: query,
    data: onboardingSettings
  });
}
export function removeOnboardingSettings(view, key) {
  var removeSettingsUrl = ONBOARDING_SETTINGS_PATH + "/" + view + "/" + key;

  if (!key) {
    key = view;
    removeSettingsUrl = ONBOARDING_SETTINGS_PATH + "/" + key;
  }

  return http.delete(removeSettingsUrl);
}