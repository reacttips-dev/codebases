import PortalIdParser from 'PortalIdParser';
import { parse, stringify } from 'hub-http/helpers/params';
import { getHublet, isHublet } from './hublet'; // Taken from https://stackoverflow.com/a/31432012

var RELATIVE_URL_REGEX = /^(?!www\.|(?:http|ftp)s?:\/\/|[A-Za-z]:\\|\/\/).*/;
export var localOr = function localOr(overrideKey) {
  var subDomain = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'api';
  var result;

  try {
    if (window.localStorage[overrideKey] === 'local') {
      result = 'local';
    }
  } catch (error) {
    /* Noop */
  }

  if (!result) {
    result = subDomain;
  }

  if (isHublet()) {
    result = result + "-" + getHublet();
  }

  return result;
};
export var isQA = function isQA() {
  return window.location.host.indexOf('hubspotqa') > -1;
};
export var getBaseUrl = function getBaseUrl(opts) {
  var localOverride = opts.localOverride,
      subDomain = opts.subDomain,
      domain = opts.domain;
  var subDomainOverride = localOr(localOverride, subDomain);
  var domainOverride = domain || 'hubspot';
  return isQA() ? "https://" + subDomainOverride + "." + domainOverride + "qa.com" : "https://" + subDomainOverride + "." + domainOverride + ".com";
};

var isRelativeUrl = function isRelativeUrl(url) {
  return RELATIVE_URL_REGEX.test(url);
};

var getUrlWithPortalId = function getUrlWithPortalId(url) {
  if (!url.includes('%portalId%')) {
    return url;
  }

  return url.replace(/%portalId%/g, String(PortalIdParser.get()));
};

export var parseReturnUrl = function parseReturnUrl(url) {
  if (!url) {
    return undefined;
  }

  if (!isRelativeUrl(url)) {
    return undefined;
  }

  return getUrlWithPortalId(url);
};
export var removeQueryParams = function removeQueryParams(queryParamKeys) {
  var _window = window,
      history = _window.history,
      location = _window.location; // Get query params object and remove params by argument

  var queryParams = parse(location.search.slice(1));
  queryParamKeys.forEach(function (queryParamKey) {
    delete queryParams[queryParamKey];
  });
  var search = ''; // format query params object to query string

  var queryString = stringify(queryParams);

  if (queryString) {
    // Remove `=undefined` for query parameter without value
    // For example: foo=undefined&bar=1 will be foo&bar=1
    search = ("?" + queryString).replace(/=undefined(&|#|$)/, '$1');
  } // Use replaceState to change url which won't cause page re-rendering


  history.replaceState(history.state, '', "" + location.pathname + search);
};