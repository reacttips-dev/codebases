const AnalyticsWebClient = require('@atlassiansox/analytics-web-client');
const _ = require('lodash');

let analyticsClientPromise;
let EnvironmentVariableType = 'prod';
EnvironmentVariableType = (EnvironmentVariableType === 'test'
  ? 'staging'
  : EnvironmentVariableType
).toUpperCase();

/**
 * Retrieves client origin and user agent and returns as
 * AnalyticsWebClient.originType and AnalyticsWebClient.platformType strings
 */
function getOriginAndUserAgent() {
  const env = {};
  if (/Electron/.test(window.navigator.userAgent)) {
    env.origin = AnalyticsWebClient.originType.DESKTOP;
    if (/Macintosh/.test(window.navigator.userAgent)) {
      env.platform = AnalyticsWebClient.platformType.MAC;
    } else if (/Windows/.test(window.navigator.userAgent)) {
      env.platform = AnalyticsWebClient.platformType.WINDOWS;
    } else if (/Linux/.test(window.navigator.userAgent)) {
      env.platform = AnalyticsWebClient.platformType.LINUX;
    } else {
      env.platform = AnalyticsWebClient.platformType.WEB;
    }
  } else {
    env.origin = AnalyticsWebClient.originType.WEB;
    env.platform = AnalyticsWebClient.platformType.WEB;
  }
  return env;
}

/**
 * returns a Promise which resolves in a new initialized AnalyticsWebClient obj.
 * result is cached in [analyticsClientPromise]
 */
function getAnalyticsWebClient() {
  if (!analyticsClientPromise) {
    analyticsClientPromise = window._trello.member('id').then(function(m) {
      const env = getOriginAndUserAgent();
      const analyticsClient = new AnalyticsWebClient.default({
        env: AnalyticsWebClient.envType[EnvironmentVariableType],
        product: 'trello',
        origin: env.origin,
        platform: env.platform,
        locale: window.locale || 'en-US',
      });
      analyticsClient.setTenantInfo(AnalyticsWebClient.tenantType.NONE);
      if (m && m.id !== 'notLoggedIn') {
        analyticsClient.setUserInfo(AnalyticsWebClient.userType.TRELLO, m.id);
      }
      return analyticsClient;
    });
  }
  return analyticsClientPromise;
}

function _normalizeContainers(containers) {
  return _(containers)
    .pick('enterprise', 'organization', 'board', 'list', 'card')
    .pickBy(val => val && val.id)
    .mapValues(({ id }) => ({ id }))
    .value();
}

/**
 * Retrieves container information for analytics. e.g. board and org ids
 *
 * @param {*} trello A reference to Trello e.g. TrelloPowerUp.iframe()
 */
function getContainers(trello = window._trello) {
  const ctx = trello && typeof trello.getContext === 'function' && trello.getContext();
  if (!ctx || !ctx.board) {
    return {};
  }
  return _normalizeContainers({
    board: { id: ctx.board },
    organization: { id: ctx.organization },
  });
}

/**
 * Wrapper for [sendUIEvent] that ensures AnalyticsWebClient obj is initialized.
 *
 * @param {*} event is the event payload
 */
function sendUIEvent(event) {
  return getAnalyticsWebClient().then(client =>
    client.sendUIEvent({
      containers: getContainers(),
      ...event,
    })
  );
}

/**
 * Wrapper for [sendTrackEvent] that ensures AnalyticsWebClient obj is initialized.
 *
 * @param {*} event is the event payload
 */
function sendTrackEvent(event) {
  return getAnalyticsWebClient().then(client =>
    client.sendTrackEvent({
      containers: getContainers(),
      ...event,
    })
  );
}

/**
 * Wrapper for [sendScreenEvent] that ensures AnalyticsWebClient obj is initialized.
 *
 * @param {*} event is the event payload
 */
function sendScreenEvent(event) {
  return getAnalyticsWebClient().then(client =>
    client.sendScreenEvent({
      containers: getContainers(),
      ...event,
    })
  );
}

module.exports = {
  sendUIEvent,
  sendTrackEvent,
  sendScreenEvent,
};
