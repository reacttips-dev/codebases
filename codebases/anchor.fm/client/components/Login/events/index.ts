import { trackEvent } from '../../../modules/analytics';
import { AdjustTrackEvent } from '../../../modules/analytics/adjust';

const events = {
  trackSocialClick: () => {
    trackEvent(
      null,
      { eventToken: AdjustTrackEvent.ONBOARDING_COMPLETED },
      { providers: [(window as any).Adjust] }
    );

    trackEvent(
      null,
      { eventToken: AdjustTrackEvent.ONBOARDING_COMPLETED_UNIQUE },
      { providers: [(window as any).Adjust] }
    );
  },
};

export default events;
