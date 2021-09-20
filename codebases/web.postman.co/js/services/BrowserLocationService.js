import { _matchPath, _getQueryStringParams, _getQueryParamsString } from '../utils/NavigationUtil';
import URLViewManager from '../modules/view-manager/URLViewManager';

const REQUESTER_LOCAL_DEV_BASE_PATH = 'build/html/requester.html';
const RUNNER_LOCAL_DEV_BASE_PATH = 'build/html/runner.html';
const localServerBasePaths = {
  runner: RUNNER_LOCAL_DEV_BASE_PATH,
  requester: REQUESTER_LOCAL_DEV_BASE_PATH
};

class BrowserLocationService {
  _initialURL;

  init (app) {
    this._initialURL = window.location.href;
    this._setBaseURL(app);
    pm.logger.info('BrowserLocationService ~ init initialized');
  }

  constructor () {
  }

  /**
   * We set the base URL for the app here. While performing navigation, we will
   * only consider the path in the URL after removing the base URL from the beginning
   *
   * This baseURL will be (origin + base path for the app). For example, assume the
   * user goes to - https://www.foo.com/x_path/y_path/z_path. In this case, let the base
   * path be x_path.
   *
   * So, the baseURL will be - https://www.foo.com/x_path. The app will only start handling
   * navigation for path after the baseURL
   */
  _setBaseURL (app) {
    const isDevEnv = window.RELEASE_CHANNEL === 'dev';
    let domain = window.location.origin,

        // TO DO: The app base path needs to be sent by the server as the window.BASE_URL_PREFIX
        // variable. Currently the service sends '/build' as the BASE_URL_PREFIX because earlier
        // we were assuming that the app is always in build mode. We need to update this to `/`
        // because this assumption no longer holds true with the introduction of home mode (which is
        // served at the /home endpoint)
        appBasePath = '/',
        basePath = isDevEnv ? localServerBasePaths[app] : appBasePath;

    let baseUrl = domain + (basePath.startsWith('/') ? '' : '/') + basePath;

    // _baseURL is the global variable used to keep track of the baseURL for the app
    this._baseURL = baseUrl ? baseUrl.replace(/\/$/, '') : '';
  }

  /**
   * Returns the base URL for the app
   */
  getBaseURL () {
    // If the base URL has not been set, call the _setBaseURL function to set it
    if (!this._baseURL) {

      // The argument is the app name (requester/runner). Since  we have stopped
      // serving the runner as a separate app, we can give the app name as 'requester'.
      this._setBaseURL('requester');
    }

    return this._baseURL;
  }

  /**
   * Returns the URL currently being served.
   * NOTE: Doesn't include the base URL.
   * @param {String} paramUrl
   *
   * @return {String}
   */
  getCurrentURL (paramUrl) {
    let href = paramUrl || window.location.href;
    return this._getURLFromHref(href);
  }

  getInitialURL () {
    let href = this._initialURL;
    return this._getURLFromHref(href);
  }

  updateCurrentURL (url, options) {
    // If URL starts with '/' then we need to remove the '/'
    if (url && url.startsWith('/')) {
      url = url.slice(1);
    }
    let newHref = this._baseURL + '/' + url;
    if (window.location.href !== newHref) {
      if (options && options.replace) {
        window.history.replaceState({}, '', newHref);
      } else {
        window.history.pushState({}, '', newHref);
      }
    }
    URLViewManager.updateURLForViews(url, options && options.matchedRoutes);
  }

  _getURLFromHref (href) {
    let url = href.indexOf(this._baseURL) >= 0 ? href.split(this._baseURL)[1] : '';

    // The first condition is to ensure that the leadin `/` is not stripped out
    // if the route is explicitly just '/'
    if (url !== '/' && url.startsWith('/')) {
      url = url.substring(1);
    }
    return url;
  }
}

export default new BrowserLocationService();
