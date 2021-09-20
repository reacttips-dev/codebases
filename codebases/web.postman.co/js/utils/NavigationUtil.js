import pathToRegexp from 'path-to-regexp';
import HttpService from './HttpService';
import {
  PUBLIC_PROFILE_TYPE_USER,
  PUBLIC_PROFILE_TYPE_TEAM
} from '../constants/PublicProfileServiceConstants';
import CurrentUserDetailsService from '../services/CurrentUserDetailsService';

const VALID_PUBLIC_PROFILE_TYPES = [
  PUBLIC_PROFILE_TYPE_USER,
  PUBLIC_PROFILE_TYPE_TEAM
],
  cache = {},
  cacheLimit = 10000,

  // The pattern to determine if a URL has any friendly slug
  FRIENDLY_SLUG_PATTERN = /\/[^\/]*~/g;

let cacheCount = 0;

/**
 * Encode and create a query string
 * @param {String} key
 * @param {String} value
 */
export function _buildQueryString (key, value) {
  let esc = encodeURIComponent;
  return `${esc(key)}=${esc(value)}`;
}

/**
 * Decode a query param value
 * @param {String} value
 */
export function _decodeQueryParamValue (value) {
  return value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
}

/**
 * Extracts query parameters from the url
 * @param {*} url
 */
export function _getQueryStringParams (url) {
  return url ? url
    .split('&')
    .reduce((params, param) => {
      let [key, value] = param.split('='),
        paramKey = _decodeQueryParamValue(key);

      // If the query param key already exists that means multiple value exists for the same key and we need to form an array
      if (params[paramKey]) {
        // First time when a value is found with the same key, we need to form an array
        !Array.isArray(params[paramKey]) && (params[paramKey] = [params[paramKey]]);

        // All subsequent values must be pushed to the same array
        params[paramKey].push(_decodeQueryParamValue(value));
      } else {
        params[paramKey] = _decodeQueryParamValue(value);
      }
      return params;
    }, {}
    )
    : {};
}

/**
 * Converts the params into the query string
 * @param {Object} params key value pairs for query params
 * @returns {String} query string
 */
export function _getQueryParamsString (params = {}) {
  var queryStrings = Object.entries(params)
    .reduce((queries, [paramKey, paramValue]) => {
      if (Array.isArray(paramValue)) {
        paramValue.forEach((value) => queries.push(_buildQueryString(paramKey, value)));
      } else {
        queries.push(_buildQueryString(paramKey, paramValue));
      }
      return queries;
    }, []);

  return queryStrings.join('&');
}

/**
 * Matches a URL with the registered pattern
 * For example: URL => `workspaces/workspaceA` with the pattern `workspaces/:wid`
 * @param pathname The URL to match
 * @param options has the path against which the URL is compared.
 * @return the route params if matched
 */
export function _matchPath (pathname, options = {}) {
  if (typeof options === 'string' || Array.isArray(options)) {
    options = { path: options };
  }

  const { path, exact = false } = options;

  const paths = [].concat(path);

  return paths.reduce((matched, path) => {
    if (!path && path !== '') return null;
    if (matched) return matched;

    const { regexp, keys } = _compilePath(path, {
      end: exact
    });
    const match = regexp.exec(pathname);

    if (!match) return null;

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) return null;

    return {
      path, // the path used to match
      url: path === '/' && url === '' ? '/' : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo, key, index) => {
        memo[key.name] = values[index];
        return memo;
      }, {})
    };
  }, null);
}

/**
 * Remove any friendly slugs from url
 * @param {String} url
 */
export function removeFriendlySlugs (url) {
  return url.replace(FRIENDLY_SLUG_PATTERN, '/');
}

/**
 * Get query string, hash fragments and path url
 */
export function getUrlParts (url) {
  let hashFragment = '',
    queryString = '',
    pathUrl = '';

  if (url) {
    let mainUrl;
    [mainUrl = '', hashFragment = ''] = url.split('#');
    [pathUrl = '', queryString = ''] = mainUrl.split('?');
  }

  return {
    pathUrl,
    queryString,
    hashFragment
  };
}

/**
 * Get dynamic segments from route pattern
 * @param {String} routePattern route pattern
 */
export function getDynamicSegmentsFromRoutePattern (routePattern) {
  let keys = [];
  pathToRegexp(routePattern, keys, { end: true });

  // The API returns an object with dynamic segment as name, where it occurs etc
  // We are only interested in name from this
  // Mapping the array of objects to array of dynamic segment names
  return keys.filter((key) => key && key.name).map((key) => key.name);
}

/** */
function _compilePath (path, options) {
  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

  if (pathCache[path]) return pathCache[path];

  const keys = [];
  const regexp = pathToRegexp(path, keys, options);
  const result = { regexp, keys };

  if (cacheCount < cacheLimit) {
    pathCache[path] = result;
    cacheCount++;
  }

  return result;
}

/**
 * Fetches public profile data for the given type and IDs
 *
 * @async
 * @param {String} type - The type of entity to fetch data for (team, user)
 * @param {Array<String>} ids - The user or team IDs to fetch data for
 *
 * @return {Promise} A Promise which resolves with the response from the API.
 *                   Resolves with an object which contains the `users` or
 *                   `teams` key whose value is a map of ID->Data
 *                   Rejects with error instance
 */
export function fetchUserPublicProfile (type, ids) {
  // Bail if invalid type specified
  if (!VALID_PUBLIC_PROFILE_TYPES.includes(type)) {
    throw new TypeError(`fetchPublicProfile~Invalid type ${type} specified.`);
  }

  // Bail if invalid ids type
  if (!(ids && Array.isArray(ids))) {
    throw new TypeError('fetchPublicProfile~Invalid user id specified');
  }

  let user = CurrentUserDetailsService.getCurrentUserDetails();

  // Endpoint to be used for fetching public profile details for a user/team
  const PUBLIC_PROFILE_URL = `${pm.apiUrl}/public_profile`,
    accessToken = user.access_token || {};

  return HttpService
    .request(PUBLIC_PROFILE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': accessToken
      },
      body: JSON.stringify({ type, ids })
    })
    .then((response) => response.body);
}

/**
 * @method _authenticatedRequest
 * @description Adds access_token to the header of the request
 */
function _authenticatedRequest (path, options) {
  if (options.user) {
    options.headers = options.headers || {};
    options.headers['x-access-token'] = _.get(options, 'user.access_token', '');
  }
  return HttpService.request(path, _.omit(options, ['user']));
}

/**
 * @method createHandover
 * @description It creates the handover in the identity service end by providing the uuidV4 token
 * @param {Object} user
 * @param {UUIDV4} token The token to be used to generate the handover
 * @param {continueURL}
 */
export function createHandover (token, continueURL) {
  const createHandoverURL = `${pm.identityUrl}/api/handover/multifactor`,
    data = { handover: { token } };

  continueURL && (data.handover.continue = continueURL);

  let user = CurrentUserDetailsService.getCurrentUserDetails();
  _authenticatedRequest(createHandoverURL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    user,
    body: JSON.stringify(data)
  });
}

/**
 * @private
 * @method getHandoverRoute
 * @description generate the handover route for the specified info
 * @param {Object} user
 * @param {String} redirectPath
 * @param {UUIDV4} handoverToken
 */
export function getHandoverRoute (user, handoverToken) {
  let payloadParts = [
    `user=${user.id}`,
    `handover_token=${handoverToken}`
  ],
    queryParams = payloadParts.join('&');

  return `${pm.identityUrl}/handover/multifactor?${queryParams}`;
}

/**
 * Construct the final URL from route with route params as placeholders
 * @param {String} routePath the complete route path. For example - workspace/:wid/environment/:eid
 * @param {Object} routeParams route parameters object { wid: workspace-id, eid: env-id }
 * @param {Object} queryParams query params object
 * @param {String} hashFragment hash fragment
 * @returns {String} final URL
 */
export function constructUrl (routePath, routeParams, queryParams, hashFragment) {

  let url = routePath;

  // Insert all route params
  routeParams && Object.entries(routeParams).forEach(([key, value]) => {
    url = url.replace(`:${key}`, encodeURIComponent(value));
  });

  // Check if query param is present and build the query params string
  if (!_.isEmpty(queryParams)) {
    url = url.concat('?', _getQueryParamsString(queryParams));
  }

  // Check if hash fragment is present and append the hash fragment
  // The assumption here is user don't need to pass objects as hash fragment, hence the param is not stringified
  if (hashFragment) {
    url = url.concat('#', encodeURIComponent(hashFragment));
  }

  return url;
}
