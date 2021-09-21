import { trackEvent } from '../../../modules/analytics';

export const clickedFooterLink = (link: string) => {
  trackEvent(
    null,
    {
      eventCategory: 'Footer',
      eventAction: 'Click',
      eventLabel: `${link} Link`,
    },
    { providers: [ga] }
  );
};
