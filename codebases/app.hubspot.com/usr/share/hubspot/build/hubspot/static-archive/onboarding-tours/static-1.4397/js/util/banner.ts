import { isInOnboardingSession, delayUntilIdle, insertOnboardingToursBanner, hasNavBar } from './bannerFrame';
export var BANNER_TYPES = {
  TASK: 'task'
};
export var getBannerContainer = function getBannerContainer() {
  return document.getElementById('onboarding-tours-banner');
};
export var getBannerFrame = function getBannerFrame() {
  return document.getElementById('onboarding-tours-banner-frame');
};
export var getOnboardingGuide = function getOnboardingGuide() {
  if (!window.sessionStorage) {
    return null;
  }

  try {
    var onboardingGuideValue = window.sessionStorage.getItem('ONBOARDING_TOURS_GUIDE');

    if (!onboardingGuideValue) {
      return null;
    }

    return JSON.parse(onboardingGuideValue);
  } catch (e) {
    return null;
  }
};
export var postOnboardingGuide = function postOnboardingGuide(config) {
  var iframe = getBannerFrame();

  if (!iframe || !iframe.contentWindow) {
    return;
  }

  iframe.contentWindow.postMessage({
    key: 'ONBOARDING_TOURS_GUIDE',
    value: config || null
  }, '*');
};
export var enableBanner = function enableBanner(config) {
  postOnboardingGuide(config);
};
export var closeBanner = function closeBanner() {
  postOnboardingGuide(null);
};
export var isBannerEnabled = function isBannerEnabled() {
  return document.querySelector('.onboarding-tours-banner') !== null;
};
export var openTaskCompletionModal = function openTaskCompletionModal(taskKey) {
  var config = getOnboardingGuide() || {};

  if (config && config.type === BANNER_TYPES.TASK && config.key === taskKey) {
    postOnboardingGuide(Object.assign({}, config, {
      completed: true
    }));
  }
};
export var closeTaskCompletionModal = function closeTaskCompletionModal(taskKey) {
  var config = getOnboardingGuide() || {};

  if (config && config.type === BANNER_TYPES.TASK && config.key === taskKey) {
    postOnboardingGuide(Object.assign({}, config, {
      completed: false
    }));
  }
};
export var closeOnboardingTour = function closeOnboardingTour() {
  var tourWindow = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '*';
  tourWindow.postMessage({
    key: 'ONBOARDING_TOURS',
    action: 'close'
  }, origin);
};
export function loadOnboardingTourBanner() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var ignoreNavBar = options.ignoreNavBar,
      taskId = options.taskId;

  if (taskId || isInOnboardingSession()) {
    delayUntilIdle(function () {
      if (ignoreNavBar === true || !hasNavBar()) {
        insertOnboardingToursBanner(taskId);
      }
    });
  }
}