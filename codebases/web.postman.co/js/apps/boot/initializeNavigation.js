import NavigationService from '../../services/NavigationService';

import PerformanceTelemetryService from '../../services/PerformanceTelemetryService';
import ClientFoundationTelemetryConfig from '../../../appsdk/telemetry/config/config';
import { getLCP, getFID } from 'web-vitals';
import { getUrlParts } from '../../utils/NavigationUtil';

const activeNavigationCompleteTransition = new Event('activeNavigationCompleteTransition');

/**
 *  Initializes the Navigation System
 * The is a suitable place for all squads to register their routes.
 * @typedef {import("../../services/DesktopLocationService").default} DesktopLocationService
 * @typedef {import("../../services/BrowserLocationService").default} BrowserLocationService
 * @param {string} app
 * @param {DesktopLocationService|BrowserLocationService} locationService
 * @param {Function} cb
 */
export default function initializeNavigation (app, locationService, cb) {
  if (!locationService) {
    pm.logger.error('initializeNavigation~boot - locationService not found.');
    cb && cb(null);
    return;
  }
  NavigationService.initialize(app, locationService);

  if (window.SDK_PLATFORM === 'browser') {
    // Reacts to the active route changes
    window.onpopstate = function (event) {
      let targetHref = event.target.location.href;
      let url = locationService._getURLFromHref && locationService._getURLFromHref(targetHref);
      NavigationService.transitionToURL(url);
    };
  }

  pm.logger.info('initializeNavigation~boot - Success');
  cb && cb(null);
}

/** Triggers the Navigation with the initial URl */
export function triggerInitialNavigation (cb) {

  PerformanceTelemetryService.startSpan(ClientFoundationTelemetryConfig.INITIAL_NAVIGATION_TIME);

  NavigationService.transitionToInitialURL()
    .finally(() => {
      PerformanceTelemetryService.endSpan(ClientFoundationTelemetryConfig.INITIAL_NAVIGATION_TIME);
      sendInitialPageLoadMetrics();

      // This is used to bubble up the information that initial navigation is completed
      // This is used to de-prioritize background syncing till initial
      // workflow is completed
      window.dispatchEvent(activeNavigationCompleteTransition);
      cb && cb();
    });
}

/** Used to fetch and send across Web vitals during initial load */
function sendInitialPageLoadMetrics () {
  if (window.SDK_PLATFORM === 'browser') {
    try {
      if (!newrelic) {
        throw new Error('Newrelic is not initialized or available');
      }

      let lcp = null,
      fid = null;

      getLCP((data) => {
        lcp = data.value;
        if (lcp && fid)
          sendWebVitalsToNewRelic({ lcp, fid });
      });

      getFID((data) => {
        fid = data.value;
        if (lcp && fid)
          sendWebVitalsToNewRelic({ lcp, fid });
      });

    } catch (error) {
      pm.logger.warn('Telemetry - Initial load web vitals fetch and send to newrelic failed', error);
    }
  }
}

/** Helper function to fetch navigation details for web vitals */
function getNavigationDetails () {
  return NavigationService.getInitialURL()
  .then((initialUrl) => {
    let { pathUrl } = getUrlParts(initialUrl);

    // This is to ensure that if the urlPath is coming through as null then we capture the exact path
    // This is handled the same way in the transitionToInitialUrl
    if (!pathUrl) {
      pathUrl = '/';
    }

    const activeRoutes = NavigationService.getRoutesForURL(pathUrl);

    if (!activeRoutes) {
      return {};
    }

    const routeName = activeRoutes.length && activeRoutes[activeRoutes.length - 1].name;
    const routePath = activeRoutes.length && activeRoutes.map((elem) => elem.routePattern).join('/');
    return { routeName, routePath };
  });
}

/** Helper function to fetch user details for web vitals */
function getUserDetails () {

  let userId = window.USER_ID || null,
    teamId = window.TEAM_ID || null;

  return { userId, teamId };
}

/** Helper function to send web vitals to New relic */
function sendWebVitalsToNewRelic (data) {
  getNavigationDetails()
  .then((navigationDetails) => {
    const { routeName, routePath } = navigationDetails;
    const { userId, teamId } = getUserDetails();

    // Route details are absolutely necessary to know which page is being loaded
    // If user details are not available we still send the web vitals,
    // because the metric is still useful without that information
    if (routeName && routePath) {
      let payload = {
        largestContentfulPaint: data.lcp,
        firstInputDelay: data.fid,
        routeName,
        routePath,
        userId,
        teamId
      };
      newrelic.addPageAction('InitialLoadMetrics', payload);
    }
  })
  .catch((error) => {
    pm.logger.warn('Telemetry - Initial load web vitals fetch and send to newrelic failed', error);
  });
}
