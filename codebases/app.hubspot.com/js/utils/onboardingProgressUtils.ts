import { GET } from './API';
import * as tempStorage from 'unified-navigation-ui/utils/tempStorage';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
var BASE_URL = '/usercontext-app/v1';
var GETTING_STARTED_GROUP_KEY_OVERRIDE = 'GETTING_STARTED_GROUP_KEY_OVERRIDE';
var onboardingProgressCache = {
  progress: 0,
  hasFetched: false
};
export function getCachedOnboardingProgress() {
  return onboardingProgressCache.hasFetched ? onboardingProgressCache.progress : 0;
}
export function setCachedOnboardingProgress(progress) {
  onboardingProgressCache.progress = progress;
  onboardingProgressCache.hasFetched = true;
}
export function fetchOnboardingProgress(callback) {
  var maybeCache = getCachedOnboardingProgress();

  if (maybeCache.hasFetched) {
    callback(maybeCache.percentage);
  } else {
    GET(BASE_URL + "/onboarding/progress/summary?portalId=" + getPortalId(), function (response) {
      var completedTasksCount = response.completedTasksCount;
      var tasksCount = response.tasksCount;

      try {
        var gettingStartedOverride = tempStorage.get(GETTING_STARTED_GROUP_KEY_OVERRIDE);

        if (gettingStartedOverride === 'experienced' || gettingStartedOverride === 'getting_started_experienced') {
          // A shorter (3 item) checklist shows for certain users. Syncs up the navigation progress bar with this override.
          tasksCount = 3;
        }
      } catch (e) {
        /* Noop */
      }

      var percentageComplete = Math.min(Math.round(completedTasksCount / tasksCount * 100), 100);
      setCachedOnboardingProgress(percentageComplete);
      callback(percentageComplete);
    });
  }
}