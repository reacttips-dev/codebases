import { fetchOnboardingProgress } from './onboardingProgressUtils';
import { getQueryParam } from './queryParamHelpers';
import * as tempStorage from 'unified-navigation-ui/utils/tempStorage';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
var ONBOARDING_USER_ATTRIBUTE_BASE = 'GrowthOnboarding:ShouldSeeNewOnboarding';
var ONBOARDING_ENROLLED_LOCAL_STORAGE_KEY = 'GrowthOnboarding:IsEnrolledInGettingStarted';
var ONBOARDING_FINISHED_KEY = 'HAS_FINISHED_GETTING_STARTED';
var ONBOARDING_LOCAL_STORAGE_KEY = 'getting-started-ui';
var GETTING_STARTED_APP_BASE_URL = '/getting-started/';
var FIFTEEN_MINUTES_IN_MILISECONDS = 1000 * 60 * 15;
export function userIsEnrolledInOnboarding(userAttributes, userId) {
  var isEnrolledOnThisPageload = getQueryParam('enroll');
  var isOnGettingStartedPage = window.location.href.indexOf(GETTING_STARTED_APP_BASE_URL) > -1;
  var maybeLocalStorageGettingStarted = tempStorage.get(ONBOARDING_LOCAL_STORAGE_KEY); // Checks the localStorage flag which is set the user has finished the onboarding
  // And hides the onboarding progress bar until the back-end is updated

  if (maybeLocalStorageGettingStarted) {
    var projectStorageId = getPortalId() + "-" + userId;

    try {
      var localStorageGettingStarted = JSON.parse(maybeLocalStorageGettingStarted)[projectStorageId];

      if (localStorageGettingStarted && localStorageGettingStarted[ONBOARDING_FINISHED_KEY]) {
        return false;
      }
    } catch (error) {
      /* Noop */
    }
  }

  if (isEnrolledOnThisPageload && isOnGettingStartedPage) {
    return true;
  }

  var maybeLocalStorageEnrollmentTimestamp = tempStorage.get(ONBOARDING_ENROLLED_LOCAL_STORAGE_KEY);

  if (maybeLocalStorageEnrollmentTimestamp) {
    var currentTimestamp = Date.now();

    if (currentTimestamp - parseInt(maybeLocalStorageEnrollmentTimestamp, 10) > FIFTEEN_MINUTES_IN_MILISECONDS) {
      tempStorage.remove(ONBOARDING_ENROLLED_LOCAL_STORAGE_KEY);
    } else {
      return true;
    }
  }

  var onboardingAttributeValue = userAttributes[ONBOARDING_USER_ATTRIBUTE_BASE + ":" + getPortalId()];

  if (onboardingAttributeValue) {
    try {
      return JSON.parse(onboardingAttributeValue);
    } catch (err) {
      return false;
    }
  } else {
    return false;
  }
}
export function setupGettingStartedProgress() {
  fetchOnboardingProgress(function (progress) {
    var progressHook = document.getElementById('getting-started-progress-bar--progress-hook');

    if (progressHook) {
      progressHook.style.width = progress + "%";
    }

    var progressText = document.getElementById('getting-started-progress-bar--progress-text');

    if (progressText) {
      progressText.innerText = progress + "%";
    }
  });
}