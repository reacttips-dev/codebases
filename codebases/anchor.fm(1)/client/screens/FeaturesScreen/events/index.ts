import { AnalyticsMarketingPageName } from '../../../components/MarketingPagesShared/events';
import { trackEvent } from '../../../modules/analytics';
import { FeaturesSectionAnalyticsName } from '../types';

const events = {
  clickNav: (sectionName: FeaturesSectionAnalyticsName) => {
    trackEvent(
      null,
      {
        eventCategory: AnalyticsMarketingPageName.FEATURES,
        eventAction: 'Click',
        eventLabel: `Navigate to ${sectionName}`,
      },
      // eslint-disable-next-line
      { providers: [ga] }
    );
  },
};

export { events };
