import { trackEvent } from '../../modules/analytics';

export enum AnalyticsMarketingPageName {
  HOME = 'Homepage',
  SWITCH = 'Switch',
  FEATURES = 'Features',
}

const sharedEvents = {
  clickGetStartedCTA: (pageName: AnalyticsMarketingPageName) => {
    trackEvent(
      null,
      {
        eventCategory: pageName,
        eventAction: 'Click',
        eventLabel: 'Get Started CTA',
      },
      // eslint-disable-next-line
      { providers: [ga] }
    );
  },
  clickSwitchToAnchorLink: (pageName: AnalyticsMarketingPageName) => {
    trackEvent(
      null,
      {
        eventCategory: pageName,
        eventAction: 'Click',
        eventLabel: 'Switch To Anchor Link',
      },
      // eslint-disable-next-line
      { providers: [ga] }
    );
  },
};

export { sharedEvents };
