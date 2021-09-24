import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import PortalIdParser from 'PortalIdParser';
import { fetchOnboardingSettings, patchOnboardingSettings } from './api/onboardingSettingsApi';
import { setGroupKey } from './api/userContextApi';
export var ONBOARDING_VIEWS = {
  SALES: 'sales',
  MARKETING: 'marketing',
  SERVICE: 'service',
  CMS: 'cms',
  OPS: 'ops'
};
export var getOnboardingSettings = function getOnboardingSettings(userId, portalId) {
  return fetchOnboardingSettings(userId, portalId);
};
export var setOnboardingSettings = function setOnboardingSettings(onboardingSettings, userId) {
  var portalId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : PortalIdParser.get();
  var options = arguments.length > 3 ? arguments[3] : undefined;
  return patchOnboardingSettings(onboardingSettings, userId, portalId, options);
};
export var setHubOnboardingSettings = function setHubOnboardingSettings(view, settings, userId) {
  var portalId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : PortalIdParser.get();
  var onboardingSettings = {
    views: _defineProperty({}, view, settings),
    selectedView: view
  };
  var settingsRequests = [setOnboardingSettings(onboardingSettings, userId, portalId)];

  if (settings.groupKey) {
    settingsRequests.push(setGroupKey(settings.groupKey));
  }

  return Promise.all(settingsRequests);
};