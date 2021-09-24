import trackEvent from './trackEvent';

export default trackScreenView;

function trackScreenView(screenName, attributes = {}) {
  // only logging subset for mParticle
  trackEvent(
    'screen_viewed',
    {
      ...attributes,
      screen_name: screenName,
    },
    { providers: [mParticle] }
  );
}
