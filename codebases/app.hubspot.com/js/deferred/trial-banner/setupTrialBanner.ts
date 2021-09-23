import { GET } from 'unified-navigation-ui/utils/API';
import isApp from '../../utils/isApp';
import { remove, set } from '../../utils/tempStorage';
import { delayUntilIdle, insertTrialBanner, removePlaceholderTrialBanner } from './utils';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId'; // Should put this in its own file

export function setupTrialBanner() {
  var portalId = getPortalId();

  if (!isApp()) {
    return;
  }

  delayUntilIdle(function () {
    if ("" + portalId === '142915' || "" + portalId === '2659927' || "" + portalId === '19634235') {
      remove('PLACEHOLDER_TRIAL_BANNER');
      removePlaceholderTrialBanner();
      return;
    }

    GET("/monetization-service/v3/trials/banner/all?portalId=" + portalId, function (trialState) {
      try {
        if (!trialState.length) {
          remove('PLACEHOLDER_TRIAL_BANNER');
          removePlaceholderTrialBanner();
        } else {
          insertTrialBanner(trialState);
          set('PLACEHOLDER_TRIAL_BANNER', 'true');
        }
      } catch (e) {
        return;
      }
    });
  });
}