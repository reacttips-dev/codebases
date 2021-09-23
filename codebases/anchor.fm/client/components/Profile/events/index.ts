import { trackEvent } from '../../../modules/analytics';

export const trackPressThirdPartyPlatformIconClick = (
  platformName: string
): void => {
  trackEvent(
    null,
    {
      eventCategory: 'Profile Page',
      eventAction: 'Click',
      eventLabel: `${platformName} badge`,
    },
    { providers: [ga] }
  );
};

export const trackPressListenOnSpotifyButtonClick = (): void => {
  trackEvent(
    null,
    {
      eventCategory: 'Profile Page',
      eventAction: 'Click',
      eventLabel: 'Listen on Spotify',
    },
    { providers: [ga] }
  );
};
