import { getBaseUrl } from '../../utils/API';
import NavInjector from 'nav-helpers/NavInjector';
import NavSibling from 'nav-helpers/NavSibling';
import { getPortalId } from '../../utils/getPortalId';
import { getQueryParam } from '../../utils/queryParamHelpers';
var ONBOARDING_REFERRER_TASK = 'onboarding_referrer_task';
var ONBOARDING_REFERRER_GROUP = 'onboarding_referrer_group';
export function delayUntilIdle(callback) {
  var delay = window.requestIdleCallback || window.setTimeout;
  var delayOptions = delay === window.requestIdleCallback ? {
    timeout: 5000
  } : 0;
  delay(callback, delayOptions);
}

function insertRootElement(element) {
  var navSibling = new NavSibling({
    key: 'onboarding-tours-banner',
    element: element // isPriority: true,

  });
  NavInjector.insertBefore(navSibling);
  return navSibling;
}

export function getFrameSrc() {
  var onboardingBannerUrl = getBaseUrl({
    localOverride: 'ONBOARDING_TOURS_BANNER_ENV',
    subDomain: 'app'
  }) + "/guide-onboarding-tours/" + getPortalId();
  var taskKey = getQueryParam(ONBOARDING_REFERRER_TASK);
  var groupKey = getQueryParam(ONBOARDING_REFERRER_GROUP);

  if (taskKey) {
    return groupKey ? onboardingBannerUrl + "?" + ONBOARDING_REFERRER_TASK + "=" + taskKey + "&" + ONBOARDING_REFERRER_GROUP + "=" + groupKey : onboardingBannerUrl + "?" + ONBOARDING_REFERRER_TASK + "=" + taskKey;
  }

  return onboardingBannerUrl;
} // Create onboarding-tours banner iframe

export function createFrameElement() {
  var frameElement = document.createElement('iframe');
  frameElement.id = 'onboarding-tours-banner-frame';
  frameElement.frameBorder = '0';
  frameElement.src = getFrameSrc();
  return frameElement;
}

function createRootElement() {
  // Create iframe container block element
  var blockElement = document.createElement('div');
  blockElement.id = 'onboarding-tours-banner'; // Create and append iframe to container

  var frameElement = createFrameElement();
  blockElement.style.display = 'none';
  blockElement.appendChild(frameElement);
  return blockElement;
}

export function insertOnboardingToursBanner() {
  var rootElement = createRootElement();
  insertRootElement(rootElement);
}
export function isInOnboardingSession() {
  var isEnabledFromStorage = window.sessionStorage && window.sessionStorage.getItem('ONBOARDING_TOURS_GUIDE');
  return isEnabledFromStorage || getQueryParam(ONBOARDING_REFERRER_TASK);
}