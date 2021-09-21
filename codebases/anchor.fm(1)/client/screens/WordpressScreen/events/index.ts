import { trackEvent } from '../../../modules/analytics';

export const events = {
  clickWordPressSignUpCTA: (ctaLocation: string) => {
    trackEvent(
      null,
      {
        eventCategory: 'Navigation',
        eventAction: 'Click',
        eventValue: 'wp_get_started',
        eventLabel: `${ctaLocation} CTA`,
      },
      // eslint-disable-next-line no-undef
      { providers: [ga] }
    );
  },
};
