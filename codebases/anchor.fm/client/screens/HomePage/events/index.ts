import { AnalyticsMarketingPageName } from '../../../components/MarketingPagesShared/events';
import { trackEvent } from '../../../modules/analytics';
import { FeaturesSectionAnalyticsName } from '../../FeaturesScreen/types';

const events = {
  clickFeatureCTA: (sectionName: FeaturesSectionAnalyticsName) => {
    trackEvent(
      null,
      {
        eventCategory: AnalyticsMarketingPageName.HOME,
        eventAction: 'Click',
        // Label is for backwards-compatibility / analytics continuity with the
        // previous Home page
        eventLabel: `Features ${sectionName} Read More Link`,
      },
      // eslint-disable-next-line
      { providers: [ga] }
    );
  },
  clickMakeYourOwnPodcastCTA: () => {
    trackEvent(
      null,
      {
        eventCategory: AnalyticsMarketingPageName.HOME,
        eventAction: 'Click',
        eventLabel: 'Make Your Own Podcast CTA',
      },
      // eslint-disable-next-line
      { providers: [ga] }
    );
  },
};

export { events };
