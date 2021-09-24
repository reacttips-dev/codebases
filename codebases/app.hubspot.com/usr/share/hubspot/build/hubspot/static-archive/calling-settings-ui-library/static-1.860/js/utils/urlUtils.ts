import { getFullUrl } from 'hubspot-url-utils';
export var callingUserPreferencesUrl = function callingUserPreferencesUrl(portalId) {
  return getFullUrl('app') + "/settings/" + portalId + "/user-preferences/calling";
};
export var callingActivitiesSettingsUrl = function callingActivitiesSettingsUrl(portalId) {
  return getFullUrl('app') + "/settings/" + portalId + "/objects/activities/calling";
};
export var supportUrl = function supportUrl(portalId) {
  return getFullUrl('app') + "/support/" + portalId + "/open";
};
export var callingToolSettings = function callingToolSettings(portalId) {
  return getFullUrl('app') + "/settings/" + portalId + "/calling";
};