import { trackEvent } from '../../modules/analytics';
import { ProfilePaywallsCurrentScreen } from './types';

const EVENT_CATEGORY = 'Profile Page Subscribe';

enum EventAction {
  CLICK = 'Click',
  VIEW = 'Screen View',
  SUBMIT = 'Submit',
}

enum EventLabel {
  COPY_RSS_LINK = 'Copy RSS',
  LISTEN_ON_SPOTIFY_CLICK = 'Listen on Spotify',
  PAYMENT_SUBMIT = 'Pay & subscribe',
  EMAIL_OPT_IN_CLICK = 'Email opt in',
  EMAIL_OPT_OUT_CLICK = 'Email opt out',
}

export enum OpenModalLocation {
  SUBSCRIBE_BUTTON = 'Subscribe Button',
  COVER_ART_LOCK_ICON = 'Cover Art Lock Icon',
}

const logEvent = (
  eventAction: EventAction,
  eventLabel: EventLabel | ProfilePaywallsCurrentScreen | OpenModalLocation
) =>
  trackEvent(
    eventLabel, // This parameter isn't used by GA
    {
      eventAction,
      eventLabel,
      eventCategory: EVENT_CATEGORY,
    },
    // eslint-disable-next-line
    { providers: [ga] }
  );

export const events = {
  screenView: (screen: ProfilePaywallsCurrentScreen) =>
    logEvent(EventAction.VIEW, screen),
  copyRSS: () => logEvent(EventAction.CLICK, EventLabel.COPY_RSS_LINK),
  listenOnSpotify: () =>
    logEvent(EventAction.CLICK, EventLabel.LISTEN_ON_SPOTIFY_CLICK),
  submit: () => logEvent(EventAction.SUBMIT, EventLabel.PAYMENT_SUBMIT),
  emailOptIn: () => logEvent(EventAction.CLICK, EventLabel.EMAIL_OPT_IN_CLICK),
  emailOptOut: () =>
    logEvent(EventAction.CLICK, EventLabel.EMAIL_OPT_OUT_CLICK),
  openModal: (location: OpenModalLocation) =>
    logEvent(EventAction.CLICK, location),
};
