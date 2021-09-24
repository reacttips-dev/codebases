/**
 * `customFlags` is specifically for the mParticle/Optimizely integration.
 * This allows mParticle to forward events to Optimizely.
 * In addition to the provider being `mParticle`, your customFlag object should look like the following:
 * customFlags = {
 *    OptimizelyFullStack.EventName: `whatever value`
 * }
 */
const trackEvent = (
  name,
  attributes = {},
  { providers = [] } = {},
  customFlags = {},
  mParticleEvent = 'Navigation'
) => {
  if (typeof ga !== 'undefined' && providers.includes(ga)) {
    // no mapping between providers; need explicit params
    const { eventAction, eventCategory, eventLabel, eventValue } = attributes;
    ga('send', 'event', {
      eventAction,
      eventCategory,
      eventLabel,
      eventValue,
    });
  }
  if (
    typeof mParticle !== 'undefined' &&
    mParticle.EventType &&
    providers.includes(mParticle)
  ) {
    mParticle.logEvent(
      name,
      mParticle.EventType[mParticleEvent],
      attributes,
      customFlags
    );
  }
  // facebook tracking
  if (typeof fbq !== 'undefined' && providers.includes(fbq)) {
    fbq('track', name);
  }

  if (typeof Adjust !== 'undefined' && providers.includes(Adjust)) {
    const { eventToken, userId } = attributes;
    try {
      Adjust.trackEvent({
        eventToken,
        ...(userId && {
          callbackParams: [{ key: 'user_id', value: `${userId}` }],
        }),
      });
    } catch (e) {
      console.error('Adjust event error: ', e);
    }
  }

  if (typeof optimizely !== 'undefined' && providers.includes(optimizely)) {
    optimizely.track(name);
  }
};

export default trackEvent;
