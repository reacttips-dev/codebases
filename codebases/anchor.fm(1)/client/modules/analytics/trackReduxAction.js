import getScreenFromRoute from './getScreenFromRoute';
import trackEvent from './trackEvent';
import trackScreenView from './trackScreenView';

export const MPARTICLE_META_TYPE = 'MPARTICLE_EVENT_TYPE';

export default trackAction;

/**
 * dont fire `screen_viewed` events for these screens
 *
 * at least in this case for `episode_list` we need a little more control
 * of the attributes we include in the event, so this method of firing the
 * event needs to be prevented
 */
const IGNORE_TRACK_SCREEN_VIEW = ['episode_list'];

/**
 * Follow Flux Standard Action meta property format to track any action
 * https://github.com/markdalgleish/redux-analytics#usage
 * Note... if this grows it kind of becomes its own reducer
 */
function trackAction({ type, payload }) {
  const isMparticleDefinedGlobally = typeof mParticle !== 'undefined';
  const isGADefinedGlobally = typeof ga !== 'undefined';
  if (type === MPARTICLE_META_TYPE && isMparticleDefinedGlobally) {
    trackEvent(payload.name, payload.attributes, { providers: [mParticle] });
    return;
  }
  if (isGADefinedGlobally) {
    if (type === 'route-transition') {
      // send rough estimate of how far you scrolled on the last page
      trackEvent(
        null,
        {
          eventCategory: 'Page',
          eventAction: 'Scroll',
          eventLabel: 'Percent',
          eventValue: getScrollPercentage(),
        },
        { providers: [ga] }
      );
      // special case: transition to new page in metrics
      ga('set', 'page', window.location.pathname + window.location.search);
      ga('send', 'pageview');
      // special case (mParticle)
      const screenName = getScreenFromRoute(payload.pathname);
      if (screenName && !IGNORE_TRACK_SCREEN_VIEW.includes(screenName)) {
        trackScreenView(screenName);
      }
    }
    if (type === 'event-sharing-copytext') {
      trackEvent(
        null,
        {
          eventCategory: 'Sharing',
          eventAction: 'Copy Text',
          eventLabel: payload.target,
        },
        { providers: [ga] }
      );
    }
    if (type === 'event-sharing-click') {
      trackEvent(
        null,
        {
          eventCategory: 'Sharing',
          eventAction: 'Click',
          eventLabel: payload.target,
        },
        { providers: [ga] }
      );
    }
    if (type === 'event-account-click') {
      trackEvent(
        null,
        {
          eventCategory: 'Account',
          eventAction: 'Click',
          eventLabel: payload.target,
        },
        { providers: [ga] }
      );
    }
    if (type === 'event-account-submit') {
      trackEvent(
        null,
        {
          eventCategory: 'Account',
          eventAction: 'Submit',
          eventLabel: payload.target,
        },
        { providers: [ga] }
      );
    }
    if (type === 'event-homepage-carousel') {
      const params = {
        eventCategory: 'Home Page',
        eventAction: 'Carousel',
        eventLabel: payload.target,
      };
      if (typeof payload.value !== 'undefined') {
        params.eventValue = payload.value;
      }
      trackEvent(null, params, { providers: [ga] });
    }
    if (type === 'event-homepage-click') {
      const params = {
        eventCategory: 'Home Page',
        eventAction: 'Click',
        eventLabel: payload.target,
      };
      if (typeof payload.value !== 'undefined') {
        params.eventValue = payload.value;
      }
      trackEvent(null, params, { providers: [ga] });
    }
    if (type === 'event-archive-click') {
      trackEvent(
        null,
        {
          eventCategory: 'Archive',
          eventAction: 'Click',
          eventLabel: payload.target,
        },
        { providers: [ga] }
      );
    }
    if (type === 'event-onboarding-click') {
      const params = {
        eventCategory: 'Onboarding',
        eventAction: 'Click',
        eventLabel: payload.target,
      };
      if (typeof payload.value !== 'undefined') {
        params.eventValue = payload.value;
      }
      trackEvent(null, params, { providers: [ga] });
    }
    if (type === 'event-episode-editor-submit') {
      const params = {
        eventCategory: 'Episode Editor',
        eventAction: 'Submit',
        eventLabel: payload.target,
        eventValue: payload.value,
        location: 'episode_edit',
      };
      if (typeof payload.value !== 'undefined') {
        params.eventValue = payload.value;
      }
      trackEvent('publish_button_clicked', params, { providers: [ga] });
    }

    // playback events below
    if (
      type === 'event-playback-click' ||
      type === 'event-playback-pause' ||
      type === 'event-playback-play'
    ) {
      if (payload && payload.target) {
        // non-user-initiated play/pause have no targets
        const params = {
          eventCategory: 'Playback',
          eventAction: 'Click',
          eventLabel: payload.target,
        };
        if (typeof payload.value !== 'undefined') {
          params.eventValue = payload.value;
        }
        trackEvent(null, params, { providers: [ga] });
      }
    }
    if (type === 'event-playback-expired') {
      trackEvent(
        null,
        {
          eventCategory: 'Playback',
          eventAction: 'Expired',
          eventLabel: payload.target,
        },
        { providers: [ga] }
      );
    }
    if (type === 'event-playback-listen') {
      trackEvent(
        null,
        {
          eventCategory: 'Playback',
          eventAction: 'Listen',
          eventValue: payload.value,
        },
        { providers: [ga] }
      );
    }
    if (type === 'event-listener-support-creator') {
      const params = {
        eventCategory: 'listener_support_creator',
        eventAction: payload.type,
      };
      if (payload.target) {
        params.eventLabel = payload.target;
      }
      trackEvent(null, params, { providers: [ga] });
    }
    if (type === 'event-listener-support') {
      const params = {
        eventCategory: 'listener_support',
        eventAction: payload.type,
      };
      if (payload.target) {
        params.eventLabel = payload.target;
      }
      trackEvent(null, params, { providers: [ga] });
    }
  }
}

// rounds to nearest 10%
function getScrollPercentage() {
  const { scrollTop, scrollHeight } = document.body;
  const scrollFrac = scrollTop / scrollHeight;
  return Math.round(10 * scrollFrac) * 10;
}
