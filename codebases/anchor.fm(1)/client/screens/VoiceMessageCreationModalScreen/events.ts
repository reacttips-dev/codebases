import { trackEvent } from '../../modules/analytics';

export const trackStartRecording = (): void => {
  trackEvent(
    null,
    {
      eventCategory: 'Voice Message',
      eventAction: 'Click',
      eventLabel: 'Start Recording',
    },
    { providers: [ga] }
  );
};

export const trackPlayPreview = (): void => {
  trackEvent(
    null,
    {
      eventCategory: 'Voice Message',
      eventAction: 'Click',
      eventLabel: 'Play preview',
    },
    { providers: [ga] }
  );
};

export const trackSubmit = (): void => {
  trackEvent(
    null,
    {
      eventCategory: 'Voice Message',
      eventAction: 'Click',
      eventLabel: 'Submit',
    },
    { providers: [ga] }
  );
};
export const trackSignUp = (): void => {
  trackEvent(
    null,
    {
      eventCategory: 'Voice Message',
      eventAction: 'Submit',
      eventLabel: 'Sign up',
    },
    { providers: [ga] }
  );
};

export const trackLogIn = (): void => {
  trackEvent(
    null,
    {
      eventCategory: 'Voice Message',
      eventAction: 'Submit',
      eventLabel: 'Log in',
    },
    { providers: [ga] }
  );
};

export const trackVoiceMessageSent = (): void => {
  trackEvent(
    null,
    {
      eventCategory: 'Voice Message',
      eventAction: 'Submit',
      eventLabel: 'VM sent',
    },
    { providers: [ga] }
  );
};
