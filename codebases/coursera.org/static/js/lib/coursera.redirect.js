// NOTE these functions replace window.location and do not send Location: headers

import _ from 'underscore';

import prerender from 'js/lib/prerender';
import Uri from 'jsuri';

const encodeParams = function (url, params) {
  const uri = new Uri(url);
  if (!_.isUndefined(params)) {
    if (!_.isUndefined(params.r)) {
      params.post_redirect = params.r;
    }
    _(params)
      .chain()
      .omit('r')
      .each(function (value, key) {
        uri.addQueryParam(key, value);
      });
  }

  return uri.toString();
};

export const getQueryParams = function () {
  return window.location.search;
};

export const unversionUrl = function (url) {
  const posAt = url.indexOf('@');
  if (posAt >= 0) {
    url = url.substring(0, posAt);
  }
  return url;
};

export const getPathname = function () {
  return window.location.pathname;
};

//
// These functions add to the navigation history
//
export const setPathname = function (newPath) {
  window.location.pathname = newPath;
  return newPath;
};

// if the host prefix contains backslash, it can lead to potential open redirection attacks
// for example: https://www.coursera.org/login?r=https://2899908099\dd.coursera.org/ would
// redirect the page to https://172.217.22.3
const isSafeHostPrefix = function (host) {
  return !/\\/g.test(host.split('.')[0]);
};

const getDomainFromHost = function (host) {
  return host.split('.').slice(-2).join('.');
};

export const isFromSameDomain = function (urlA, urlB) {
  const hostA = new Uri(urlA).host();
  const hostB = new Uri(urlB).host();
  return hostA === hostB || (isSafeHostPrefix(hostA) && getDomainFromHost(hostA) === getDomainFromHost(hostB));
};

export const setLocation = function (newUrl, options) {
  const statusCode = options && options.isPermanent ? 301 : 302;
  prerender.redirect(statusCode, newUrl);

  const parsedUrl = new Uri(newUrl);

  // only newUrl if hosts match or there is no host (relative url)
  let safeUrl = '/';
  if (parsedUrl.host() === '' || isFromSameDomain(newUrl, window.location.host)) {
    safeUrl = parsedUrl.toString();
  }
  window.location.href = safeUrl;
  return safeUrl;
};

/**
 * Add to nav history for authenticated users only
 * Please use userAuthorization.ensureAuthenticated or ensureAuthenticatedByRedirect otherwise
 */
export const navigateWithAuth = function (newUrl, params) {
  return setLocation(encodeParams(newUrl, params));
};

export const refresh = function () {
  window.location.reload();
};

export const getAuthRedirect = function (mode, params) {
  const urlParams = _({
    r: window.location.href,
  }).extend(params);
  const authUrl = '/' + (mode || 'signup');
  return encodeParams(authUrl, urlParams);
};

//
// These functions rewrite history
//
/**
 * Redirect to auth pages and redirect back to the current page after authentication
 */
export const authenticate = function (mode, params) {
  return window.location.replace(getAuthRedirect(mode, params));
};

/**
 * Redirect and replace the current URL in nav history for authenticated users only
 * Please use userAuthorization.ensureAuthenticated or ensureAuthenticatedByRedirect otherwise
 */
export const redirectWithAuth = function (newUrl, params) {
  // don't mess with prerender because it's auth
  return window.location.replace(encodeParams(newUrl, params));
};

/**
 * Redirect and replace the current URL in nav history for authenticated users only
 * Please use userAuthorization.ensureAuthenticated or ensureAuthenticatedByRedirect otherwise
 */
export const redirectWithAuthToPath = function (path, params) {
  // don't mess with prerender because it's auth
  return window.location.replace(encodeParams(window.location.origin + path, params));
};

export const replaceUrl = function (newUrl) {
  prerender.redirect(302, newUrl);
  window.history.replaceState({}, '', newUrl);
};

export default {
  getQueryParams,
  unversionUrl,
  getPathname,
  setPathname,
  isFromSameDomain,
  setLocation,
  navigateWithAuth,
  refresh,
  getAuthRedirect,
  authenticate,
  redirectWithAuth,
  redirectWithAuthToPath,
  replaceUrl,
};
