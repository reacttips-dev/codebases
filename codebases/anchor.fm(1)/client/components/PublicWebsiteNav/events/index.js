import { trackEvent } from '../../../modules/analytics';

export const clickNavLink = attributes => {
  trackEvent('nav_item_clicked', attributes, {
    providers: [mParticle],
  });
};
export const clickSignupButton = () => {
  trackEvent(
    'CompleteRegistration',
    {},
    {
      providers: [fbq],
    }
  );
};
export const trackProfilePageSignupEventInGA = () => {
  trackEvent(
    null,
    {
      eventCategory: 'Profile Page',
      eventAction: 'Click',
      eventLabel: 'Signs up',
    },
    { providers: [ga] }
  );
};

export const clickedNavLinkGoogleAnalytics = link => {
  trackEvent(
    null,
    {
      eventCategory: 'Navigation',
      eventAction: 'Click',
      eventLabel: `${link} Link`,
    },
    { providers: [ga] }
  );
};

/**
 * Attached this function to the window to make it available to Google Optimize experiment
 * Original and variant experiences will call the same function;
 * Google will optimize based on which variant produces more events.
 *
 * Experiment name: `profile-nav-bar-cta`
 */
global.trackProfilePageSignupEventInGA = trackProfilePageSignupEventInGA;
