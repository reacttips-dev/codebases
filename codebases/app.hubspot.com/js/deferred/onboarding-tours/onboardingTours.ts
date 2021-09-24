import isApp from '../../utils/isApp';
import { delayUntilIdle, insertOnboardingToursBanner, isInOnboardingSession } from './utils';
export function setupOnboardingToursBanner() {
  if (isApp() && isInOnboardingSession()) {
    delayUntilIdle(function () {
      insertOnboardingToursBanner();
    });
    return true;
  }

  return false;
}