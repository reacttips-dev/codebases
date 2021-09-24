const log = require('debug')('analytics:stackshare');
import initSegment from './shared/utils/analytics/segment';
import ActivityTracker from './shared/utils/analytics/activity-tracker';

log('installing global tracking functions...');
window.trackEvent = (name, data, depth = 0) => {
  if (window.analytics) {
    try {
      JSON.stringify(data);
      window.analytics.track(name, data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Invalid payload', data);
    }
  } else {
    if (depth < 30) {
      // retry in 1 sec; allows analytics to bootstrap
      setTimeout(() => window.trackEvent(name, data, depth + 1), 1000);
    } else {
      // eslint-disable-next-line no-console
      console.warn('trackEvent backoff limit reached', name, data);
    }
  }
};
window.trackPage = (name, data) => {
  if (window.analytics) {
    try {
      JSON.stringify(data);
      window.analytics.page(name, data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('Invalid payload', data);
    }
  }
};

if (typeof window !== 'undefined' && process.env.SEGMENT_KEY) {
  log('fetching user properties...');
  fetch(`/user_properties.json?current_path=${window.location.pathname}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Error fetching user properties, response not OK');
    })
    .then(user => {
      log('initializing Segment...');
      initSegment(process.env.SEGMENT_KEY).then(_analytics => {
        log('Segment loaded', _analytics);

        if (window._PAGE) {
          log('setting page context', window._PAGE.name, window._PAGE.properties);
          _analytics.page(window._PAGE.name, window._PAGE.properties);
        } else {
          log('setting empty page context');
          _analytics.page();
        }

        log('installing ActivityTracker...');
        document.addEventListener('DOMContentLoaded', () => ActivityTracker(_analytics));

        if (user && user.id) {
          log(`identifying analytics user ${user.id}`, user);
          _analytics.identify(String(user.id), user, () => log(`user ${user.id} identified`));
        } else {
          log('identifying anonymous analytics user', user);
          _analytics.identify(user, () => log(`anonymous user identified`));
        }
      });
    })
    .catch(err => log(err.message));
}
