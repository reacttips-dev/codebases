import PortalIdParser from 'PortalIdParser';
export var API_BASE_URL = 'onboardingtours/v1';
export var TOUR_ID = 'tourId';
export var ONBOARDING_TOUR_ID = 'onboardingTourId';
export var getUserGuideUrl = function getUserGuideUrl() {
  return "/user-guide/" + PortalIdParser.get();
};