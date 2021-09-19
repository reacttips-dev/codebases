import {
  CLIENT_VIEW_TRACKED,
  LOCATION_UPDATED,
  ON_FEDERATED_LOGIN_MODAL_PAGE_VIEW,
  ROUTE_UPDATE_COMPLETE
} from 'constants/reduxActions';
import { capitalize } from 'helpers';
import AppEnvironment from 'helpers/AppEnvironment';
import { guid } from 'helpers/guid';
import { getType } from 'history/historyFactory';
import { thirdPartyTrackEvent, trackPage } from 'helpers/analytics';
import { logDebug } from 'middleware/logger';
import { MARTY_URL_PREFIX_RE } from 'common/regex';
import marketplace from 'cfg/marketplace.json';

const { domain } = marketplace;

export function onFederatedModalPageView(sourcePageType) {
  return {
    type: ON_FEDERATED_LOGIN_MODAL_PAGE_VIEW,
    sourcePageType
  };
}

export function listenForPageChange(store) {
  // TODO history v4 listen includes the `action` as second arg rather than property on location
  return function(location) {
    // Dispatch a custom locationchange event to tell HF that we are no longer on the same page
    const event = new CustomEvent('locationchange', { detail: { location: location } });
    document.body.dispatchEvent(event);
    // Update store
    store.dispatch({ type: LOCATION_UPDATED, location });
  };
}

const generateTrackPayload = ({ win, zfcMetadata, normalizedUri }) => {
  const pTime = Date.now();
  const {
    location: {
      href,
      hostname
    },
    screen: {
      width,
      height,
      colorDepth
    },
    name: {
      windowId
    },
    zfc: {
      upstreamLabel,
      upstreamHost
    } = {},
    innerWidth,
    innerHeight
  } = win;

  return {
    locationHref: href,
    upstreamLabel: upstreamLabel || `marty_beta_${domain}_ssl`,
    upstreamHost: upstreamHost || hostname,
    upstreamUri: normalizedUri,
    uuid: guid(),
    pTime,
    enterHeadTime: 0,
    enterHeadMsec: 0,
    leaveBodyTime: null,
    leaveBodyMsec: null,
    screenWidth: width,
    screenHeight: height,
    screenColorDepth: colorDepth,
    documentReferrer: document.referrer || null,
    upstreamMetadata: zfcMetadata,
    windowId: windowId || guid(),
    windowWidth: innerWidth,
    windowHeight: innerHeight
  };
};

/**
 * Track a client side page view with ZFC and Google Analytics if Available
 * @param {object} win - window object
 * @param {String} uri - page URI to track.  Function will normalize URI if prefixed with /marty/
 * @param {String} title - Page title to correlated to URI
 * @param {String} [zfcMetadata] - optional base64 encoded zap.zfc.Metadata protobuf
 */
export const trackClientSidePageViewWithZfc = (win, uri, zfcMetadata) => {
  const normalizedUri = uri.replace(MARTY_URL_PREFIX_RE, '/');

  // k2
  if (window.mk2) {
    trackPage(generateTrackPayload({ win, uri, zfcMetadata, normalizedUri }));
  } else { // karakoram
    win.zfc.upstreamURI = normalizedUri;
    win.zfc.uuid = guid();
    win.zfc.pageGenerationTime = null;
    win.zfc.pageGenerationMsec = null;
    win.zfc.enterHeadTime = null;
    win.zfc.enterHeadMsec = null;
    win.zfc.leaveBodyTime = null;
    win.zfc.leaveBodyMsec = null;
    win.zfc.push(['setMetaData', zfcMetadata || null]);
    win.zfc.push(['tracker', '/track.cgi']);
  }

  const pageType = getType(normalizedUri) ? capitalize(getType(normalizedUri)) : null;
  trackTPPageView('Page View', pageType, normalizedUri);
};

/**
 * Only used in non-zfc environments to log when a track.cgi request would fire for client routed page views.
 */
const trackPageViewToConsole = (win, uri, zfcMetadata) => {
  logDebug(`track.cgi: ${uri}, metadata= ${zfcMetadata}`);
  const normalizedUri = uri.replace(MARTY_URL_PREFIX_RE, '/');
  trackPage(generateTrackPayload({ win, uri, zfcMetadata, normalizedUri }));
};

/**
 *
 * @param {object} win - window object
 * @param {String} normalizedUri - page URI to track (does not normalize /marty/)
 * @param {String} [zfcMetadata] - optional base64 encoded zap.zfc.Metadata protobuf
 */

const trackZfcPageView = AppEnvironment.hasZfc ? trackClientSidePageViewWithZfc : trackPageViewToConsole;
const trackTPPageView = AppEnvironment.hasTrackers ? thirdPartyTrackEvent : (function() {});

function trackClientRoutedPageView(location, zfcMetadata) {
  const uri = location.pathname + location.search + location.hash;
  trackZfcPageView(window, uri, zfcMetadata);
}

/**
 * Action to record that a track.cgi call was made
 * @param  {String} [zfcMetadata] Optional base64 encoded information that was included on track.cgi request.
 * @return {Object}             CLIENT_VIEW_TRACKED redux action.
 */
function recordClientView(zfcMetadata) {
  return { type: CLIENT_VIEW_TRACKED, zfcMetadata };
}
/**
 * Action creator to denote that async route has finished loading and has begun rendering.
 */
export function routeUpdateComplete() {
  return { type: ROUTE_UPDATE_COMPLETE };
}

/**
 * Fires a page view event to trackers configured in the environment and updates the last recorded page title to the store.
 * @param  {Object} pageInfo    Information on the last recorded page
 * @param  {String} [zfcMetadata] Optional base64 encoded representation of zap.zfc.Metadata protobuf
 * @return {Function}             redux-thunk action that records a client page view to zfc if necessary.
 */
export function firePageView(pageInfo, zfcMetadata) {
  return (dispatch, getState) => {
    const { pageView } = getState();
    const { location } = pageInfo;
    if (location && pageView.needsToFire) {
      trackClientRoutedPageView(location, zfcMetadata);
      dispatch(recordClientView(zfcMetadata));
    }
  };
}
