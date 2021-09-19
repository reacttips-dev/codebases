import createBrowserHistory from 'history/lib/createBrowserHistory';

import { prependAppRoot } from './AppRootUtils';
const defaultForceRefresh = () => true;
const defaultUrlCleanser = url => url;
// 16 * 60 * 60 * 1000 : 16 hours in ms, This originally came from ztoken expiration, but let's keep the behavior the same for the time being
const DEFAULT_SPA_TIME = new Date().getTime() + 57600000;

const createSmartHistory = ({
  shouldForceRefresh = defaultForceRefresh,
  urlCleanser = defaultUrlCleanser,
  browserHistory = createBrowserHistory(),
  refreshHistory = createBrowserHistory({ forceRefresh: true }),
  win = window,
  refreshTimestamp = DEFAULT_SPA_TIME
}) => {
  const isTimeToRefresh = () => new Date().getTime() > refreshTimestamp;
  const respectRefresh = url => (refresh, browser) => (isTimeToRefresh() ? refresh(url) : browser(url));
  const pushRespectRefresh = url => respectRefresh(url)(refreshHistory.push, browserHistory.push);
  const replaceRespectRefresh = url => respectRefresh(url)(refreshHistory.replace, browserHistory.replace);

  const push = function(url) {
    url = urlCleanser(url);
    return shouldForceRefresh(url, win.location.pathname)
      ? refreshHistory.push(url)
      : pushRespectRefresh(url);
  };
  const replace = function(url) {
    url = urlCleanser(url);
    return replaceRespectRefresh(url);
  };

  return {
    ...browserHistory,
    push,
    replace,
    pushPreserveAppRoot(url) {
      return push(prependAppRoot(url));
    },
    replacePreserveAppRoot(url) {
      return replace(prependAppRoot(url));
    },

    /**
     * Performs either a a full page, client side redirect, or an html5 URL replace based on the smart history configuration.
     * @param {String} url
     */
    smartReplacePreserveAppRoot(url) {
      if (shouldForceRefresh(url, win.location.pathname)) {
        return refreshHistory.replace(prependAppRoot(urlCleanser(url)));
      } else {
        return replace(prependAppRoot(url));
      }
    },

    /**
     * Useful when you always want to client-route the request. In general, usage should probably be avoided.
     */
    forceBrowserPush(url) {
      url = urlCleanser(url);
      return pushRespectRefresh(url);
    },

    /**
     * Useful when you always want to force refresh the request from a given
     * location (as opposed to relying on the global configuration for the
     * specific url). In general, usage should probably be avoided.
     */
    forceRefreshPush(url) {
      url = urlCleanser(url);
      return refreshHistory.push(url);
    }
  };
};

export default createSmartHistory;
