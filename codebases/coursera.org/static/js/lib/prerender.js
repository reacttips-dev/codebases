/**
 * Support functions for our use of Prerender.io
 *
 * @see https://prerender.io/documentation/best-practices
 *
 * TODO update apps to have a "complete" state on which we
 * set window.prerenderReady
 */

import multitracker from 'js/app/multitrackerSingleton';

import metatags from 'js/lib/metatags';
import userAgent from 'js/constants/userAgent';

const STATUS_CODE = {
  LOAD_START: 503,
  LOAD_SUCCESS: 200,
  MOVED_PERMANENTLY: 301,
};

const setPrerenderStatusCode = function (statusCode) {
  metatags.set({
    'prerender-status-code': statusCode,
  });
};

export { STATUS_CODE, setPrerenderStatusCode };

export const isPrerendering = function () {
  return userAgent.isPrerender;
};

export const redirect = function (statusCode, url) {
  const locationHeader = 'Location: ' + url;

  // set the HTTP header for pre-rendered version of this page
  metatags.set({
    'prerender-status-code': statusCode,
    'prerender-header': locationHeader,
  });
};

export const error = function (statusCode, url, message) {
  // log the error to our eventing system
  multitracker.pushV2([
    'page.error',
    {
      code: statusCode,
      url: url || location.href,
      message: message || '',
    },
  ]);

  // set the HTTP header for pre-rendered version of this page
  setPrerenderStatusCode(statusCode);
};

/**
 * @param {String} didLoad false means loading, true means loaded.
 */
export const setPageDidLoad = function (didLoad) {
  window.prerenderReady = didLoad;
  if (didLoad) {
    const prerenderStatusCodeEl = document.querySelector('meta[name="prerender-status-code"]');
    const prerenderStatusCode = prerenderStatusCodeEl && prerenderStatusCodeEl.getAttribute('content');
    const loadSuccess = prerenderStatusCode && prerenderStatusCode === STATUS_CODE.LOAD_START.toString();
    if (loadSuccess) {
      setPrerenderStatusCode(STATUS_CODE.LOAD_SUCCESS);
    }
  } else {
    setPrerenderStatusCode(STATUS_CODE.LOAD_START);
  }
};

export default {
  STATUS_CODE,
  setPrerenderStatusCode,
  isPrerendering,
  redirect,
  error,
  setPageDidLoad,
};
