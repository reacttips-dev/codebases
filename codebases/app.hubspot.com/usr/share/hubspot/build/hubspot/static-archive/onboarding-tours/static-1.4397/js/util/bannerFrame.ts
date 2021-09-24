import PortalIdParser from 'PortalIdParser';
import { getBaseUrl } from './urlUtils';
import { getQueryParam } from './queryParams';
var ONBOARDING_REFERRER_TASK = 'onboarding_referrer_task';
export function delayUntilIdle(callback) {
  if (window.requestIdleCallback) {
    return window.requestIdleCallback(callback, {
      timeout: 5000
    });
  }

  return window.setTimeout(callback, 0);
}

var insertRootElement = function insertRootElement(element) {
  var body = document.body;
  var firstChild = body.firstChild;
  body.insertBefore(element, firstChild);
};

export var getFrameSrc = function getFrameSrc(taskIdParam) {
  var portalId = PortalIdParser.get();
  var onboardingBannerUrl = getBaseUrl({
    localOverride: 'ONBOARDING_TOURS_BANNER_ENV',
    subDomain: 'app'
  }) + "/guide-onboarding-tours/" + portalId;
  var taskId = taskIdParam || getQueryParam(ONBOARDING_REFERRER_TASK);

  if (taskId) {
    return onboardingBannerUrl + "?" + ONBOARDING_REFERRER_TASK + "=" + taskId;
  }

  return onboardingBannerUrl;
}; // Create onboarding-tours banner iframe

export var createFrameElement = function createFrameElement(taskId) {
  var frameElement = document.createElement('iframe');
  frameElement.id = 'onboarding-tours-banner-frame';
  frameElement.frameBorder = '0';
  frameElement.src = getFrameSrc(taskId);
  return frameElement;
};

var createRootElement = function createRootElement(taskId) {
  // Create iframe container block element
  var blockElement = document.createElement('div');
  blockElement.id = 'onboarding-tours-banner'; // Create and append iframe to container

  var frameElement = createFrameElement(taskId);
  blockElement.style.display = 'none';
  blockElement.appendChild(frameElement);
  return blockElement;
};

export var insertOnboardingToursBanner = function insertOnboardingToursBanner(taskId) {
  var frameElement = document.getElementById('onboarding-tours-banner-frame');

  if (frameElement) {
    frameElement.src = getFrameSrc(taskId);
    return;
  }

  var rootElement = createRootElement(taskId);
  insertRootElement(rootElement);
};
export var isInOnboardingSession = function isInOnboardingSession() {
  var isEnabledFromStorage = window.sessionStorage && window.sessionStorage.getItem('ONBOARDING_TOURS_GUIDE');
  return isEnabledFromStorage || getQueryParam(ONBOARDING_REFERRER_TASK);
};
export var hasNavBar = function hasNavBar() {
  // hubspot.nav holds an object when there is a navbar
  return !!window.hubspot.nav;
};