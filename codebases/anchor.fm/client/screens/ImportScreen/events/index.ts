import { AnalyticsMarketingPageName } from '../../../components/MarketingPagesShared/events';
import { trackEvent } from '../../../modules/analytics';

const events = {
  clickHeroCTA: () => {
    trackEvent(
      null,
      {
        eventCategory: AnalyticsMarketingPageName.SWITCH,
        eventAction: 'Click',
        eventLabel: `Switch in less than 5 minutes`,
      },
      // eslint-disable-next-line
      { providers: [ga] }
    );
  },
};

export { events };
