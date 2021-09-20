import { _matchPath, _getQueryStringParams, _getQueryParamsString, removeFriendlySlugs, getDynamicSegmentsFromRoutePattern,
  getUrlParts, fetchUserPublicProfile, createHandover, getHandoverRoute, constructUrl } from '../utils/NavigationUtil';
import { EDITOR_SUB_VIEW, EDITOR_TAB } from '../constants/ViewHierarchyConstants';
import { observable, action, computed } from 'mobx';
import { BUILD_URL_REGEX, WORKSPACE } from '../../collaboration/navigation/constants';
import { openExternalLink } from '../external-navigation/ExternalNavigationService';
import uuidV4 from 'uuid/v4';
import { isServedFromPublicWorkspaceDomain } from '../../appsdk/utils/commonWorkspaceUtils';
import { PUBLIC_PROFILE_PAGE } from '../../team/constants';
import { PUBLIC_PROFILE_TYPE_USER } from '../constants/PublicProfileServiceConstants';
import CurrentUserDetailsService from './CurrentUserDetailsService';
import { PageService } from '../../appsdk/services/PageService';

const activeNavigationCompleteTransition = new Event('activeNavigationCompleteTransition');

let _routes = [],
  _requesterInitialized = false;

/**
 * Get URL origins from the URL string
 * @param {Array} urls
 * @param {Function} invalidUrlCallback
 */
function _getOriginsFromUrl (urls, invalidUrlCallback) {
    const validUrlDomains = urls.reduce((validDomains, currentUrl) => {
      // Check if the URL is valid and add the url origin to the set
      try {
        let fullUrl = new URL(currentUrl);
        validDomains.push(fullUrl.origin);
      } catch (err) {
        invalidUrlCallback && invalidUrlCallback(currentUrl, err);
      }
      return validDomains;
    }, []);
    return new Set(validUrlDomains);
}

/**
 * Get the patterns from alias arrays
 * @param {Array} aliases Alias array
 */
function _getAliasPatterns (aliases = []) {
  return aliases.map((alias) => alias.pattern);
}

/** */
function _findUrlAndAliasesMatchFromRoute (route, pathToMatch, matches, allMatchedRoutes) {
  let urlAndAliases = [route.url, ..._getAliasPatterns(route.aliases)];

  for (let url of urlAndAliases) {
    let result = _matchPath(pathToMatch, {
      path: url,
      exact: true
    });

    if (result) {
      let matchedAlias = route.aliases.find((alias) => alias.pattern === url),
        matchedAliasId = matchedAlias && matchedAlias.name;

      matches.push({
        ...route,
        matchedPattern: url,
        matchedAliasId,
        matchUrl: result.url,
        params: result.params
      });

      // Remove the matched route from the matched array so that the same route is not considered further
      // For example if just request/:id is registered then request/:id1/request/:id2 can't be a valid route
      allMatchedRoutes = allMatchedRoutes.filter((routeInstance) => routeInstance.name !== route.name);
      return true;
    }
  }

  return false;
}

/**
 * Finds all the routes matching the URL.
 * Example input: 'workspace/workspace1~123-456-789/collections/collection1~ABC/edit'
 * R1: workspace/:wid
 * R2: collection/:id
 * R3: collection/:cid/edit
 *
 * Result: [R1, R3], because R3 is the closest match for the input URL.
 *
 * NOTE: Routes are not necessarily defined in a hierarchical order.
 * Which means that parts of a URL can be mapped to multiple routes,
 * without having a parent child relationship with each other.
 * In the example above, R2 and R3 are two independent routes without any hierarchical dependency on each other.
 */
function _findURLMatches (url) {
  let matches = [];

  if (!url) {
    return [];
  }

  // If base route is provided then find the route and return
  if (url === '/') {
    let matchedBaseRoute = _findMatchingRoute(url);
    return matchedBaseRoute ? [matchedBaseRoute] : [];
  }

  // filter of empty slugs to prevent `//foo` being treated as
  // separate routes`['', 'foo']`
  let slugs = [...url.split('/').filter((slug) => slug !== ''), ''];
  let allMatchedRoutes = [];

  // Find a leaf node for the URL
  let matchedRoute = _findMatchingRoute(url);

  while (matchedRoute) {
    allMatchedRoutes.unshift(matchedRoute);
    matchedRoute = _findRouteByName(matchedRoute.parentName);
  }

  slugs.reduce((accumulator, current) => {
    let found = false;
    for (let route of allMatchedRoutes) {
      found = _findUrlAndAliasesMatchFromRoute(route, accumulator, matches, allMatchedRoutes);

      if (found) {
        break;
      }
    }

    return found ? current : accumulator + '/' + current;
  });

 return matches;
}

/** This function find a matching node in the routes
 * @param url Example: `workspace/active-workspace~123w1/collection/myCollection173/edit
 * @return route object whose full path is `workspace/:wid/collection/:cid/edit`
 */
function _findMatchingRoute (url) {
  let matches = [],
    final;

  if (!url) {
    return;
  }

  // Check all registered routes
  for (let route of _routes) {
    let routePaths = route.getFullPaths();

    routePaths.forEach((routePath) => {
      // Match the full route path with the URL
      let result = _matchPath(url, {
        path: routePath,
        exact: true
      });

      // There may be more than one matches, for example - /home, /:publicHandle
      if (result) {
        matches.push(route);
      }
    });
  }

  // If a match is not found then an attempt is made to find out a close match by removing the end slug from the URL and run the algorithm again
  if (matches.length === 0) {
    let slugs = url.split('/').filter((slug) => !_.isEmpty(slug));
    slugs.pop();
    return _findMatchingRoute(slugs.join('/'));
  }

  // If there are more than one match then prefer a more specific match
  if (matches.length > 1) {
    // more than one match is found for the URL
    // this situation occurs when a specific route and one or more generic routes match at the same time
    // for example if home and :publicHandle both are registered as top level routes, then navigating to appurl/home will yield 2 matches
    // for these cases we prefer the specific match i.e. 'home' over the generic one i.e. ':publicHandle'

    // To determine the preference - we check every route and get the number of dynamic segments in it
    // For example, if we have a route - something/:firstId/:secondId, then firstId & secondId are dynamic segments
    // If we 2 such routes registered - something/:firstId/:secondId & something/specific/:secondId
    // For a transition 'something/specific/others', we will have both the routes as matched
    // In this case we want to prefer the more specific one i.e. something/specific/:secondId
    // Calculate the number of dynamic segment
    // For the first route it's 2 - firstId & secondId
    // For the second route it's 1 - secondId
    // So we prefer the second one here
    let matchedRoute = matches.reduce((routeWithLeastDynamicSegments, currentRoute) => {
      // Get the dynamic segments of currently investigating route
      let dynamicSegments = getDynamicSegmentsFromRoutePattern(currentRoute.url);

      // If current route has less number of dynamic segment than already stored route's
      // Then mark the current route as routeWithLeastDynamicSegments
      // Store the route itself and number of dynamic segment for future comparison
      if (dynamicSegments.length < routeWithLeastDynamicSegments.dynamicSegmentCount) {
        routeWithLeastDynamicSegments = {
          dynamicSegmentCount: dynamicSegments.length,
          route: currentRoute
        };
      }
      return routeWithLeastDynamicSegments;
    }, {
      dynamicSegmentCount: Number.POSITIVE_INFINITY // We start with the Infinity so that the first encountered route will be set as routeWithLeastDynamicSegments
    });

    // matchedRoute is going to be the route with least dynamic segment
    final = matchedRoute.route;
  }
  else {
    final = matches[0];
  }

  return final;
}

/** Find the route registered by the name matching the argument */
function _findRouteByName (name) {
  if (!name) {
    return null;
  }
  return _routes.find((route) => route.name === name);
}

/** Initialize the requester legacy chunk.
 *  Temporary solution for the routing issue with home page performance.
 *  This will change to a more permenant solution by allowing dynamic route registration.
*/
async function _initializeRequesterLegacy () {
  try {
    PageService.setLoader(true);
    let { default: requesterInit } = await import(/* webpackChunkName: "requester-legacy" */ '../apps/requester/index');
    return new Promise((resolve, reject) => {
      requesterInit((err) => {
        if (err)
          reject(err);
        else
          resolve();
      });
    });
  } catch (error) {
    PageService.setLoader(false);
    throw error;
  } finally {
    _requesterInitialized = true;
  }
}

/**
 * After all the routes have been registered, a check is run to ensure that we don't have duplicate paths
 * in the route tree. For example
 * R1 : workspace/:wid
 * R2: collection/:cid
 * R3: edit
 * R4: collection/:id/edit
 * Here path to R3, and path to R4 is the same.
 *
 */
function _auditRoutes () {
  let routePathMap = {};
  let failed = false;

  for (let route of _routes) {
    let fullRoutePaths = route.getFullPaths();
    fullRoutePaths.forEach((fullPath) => {
      let normalizedFullPath = fullPath
        .replace(/(:(.*?)\/)|(:(.*?)$)/g, ':id/')
        .replace(/\/$/, '');

      if (routePathMap[normalizedFullPath]) {
        pm.logger.error('NavigationService ~ _auditRoutes: Duplicate routes found. A similar route has already been registered. Please fix the following routes: ', route.name, routePathMap[normalizedFullPath].name);
        pm.logger.error('NavigationService ~ _auditRoutes failed!');
        failed = true;
      } else {
        routePathMap[normalizedFullPath] = route;
      }
    });
  }
  if (!failed) {
    pm.logger.info('NavigationService ~ _auditRoutes passed!');
  }
}

/**
 * Extract the public handle from the current explore URL
 * @param {String} url
 */
function _getCurrentPublicHandle () {
  if (!isServedFromPublicWorkspaceDomain()) {
    return '';
  }

  const currentURL = NavigationService.getCurrentURL(),
    currentURLValidSlugs = currentURL.split('/').filter((slug) => !_.isEmpty(slug));

  return currentURLValidSlugs[0];
}

/**
 * Extract query params and hash fragment from URL
 * @param {URL} url
 */
function _getQueryStringAndHashFragmentFromURL (url) {
  return {
    queryParams: _getQueryStringParams(url.search && url.search.slice(1)),
    hashFragment: url.hash && decodeURIComponent(url.hash.slice(1))
  };
}

/**
 * Transform the received dashboard URL
 * @param {String} url
 * @param {Array} urlPathSlugs
 */
async function _transformDashboardURL (url, urlPathSlugs) {

  const isPublicWorkspace = isServedFromPublicWorkspaceDomain();

  let urlPrefix = '',
    urlSuffix = '',
    mainURL = null,
    { queryParams: queryStringObject, hashFragment } = _getQueryStringAndHashFragmentFromURL(url),
    isCanonicalURL = false;

  const validWorkspaceEntities = ['collections', 'environments', 'mocks', 'monitors', 'apis'];

  // transform /workspaces?type=${type} to /workspaces
  if (urlPathSlugs && urlPathSlugs.length === 1 && urlPathSlugs[0] === 'workspaces' && queryStringObject.type) {
    delete queryStringObject.type;
  }

  // Check if url is a dashboard URL then proceed to check if the intent can be expressed by an artemis internal URL
  else if (urlPathSlugs && urlPathSlugs.length > 1) {

    // If URL path is prefixed with dpxy then check if the path is dpxy/dashboard
    // If the path is dpxy/dashboard then do not transform such URL
    if (urlPathSlugs[0] === 'dpxy' && urlPathSlugs[1] !== 'dashboard') {
      urlPathSlugs = urlPathSlugs.slice(1);
    }

    // transform me/trash to workspace/:defaultWorkspace/trash
    if (urlPathSlugs[0] === 'me' && urlPathSlugs[1] === 'trash') {
      return {
        urlPathName: 'trash',
        queryParams: queryStringObject
      };
    }

    // URL in these formats should not be mapped /workspaces/${workspaceId}/integrations?view=browse, /collections/${id}/publish?workspace=${workspaceId}
    else if (urlPathSlugs.length > 2 && ((urlPathSlugs[0] === 'workspaces' && urlPathSlugs[2] === 'integrations' && queryStringObject.view) ||
      (urlPathSlugs[0] === 'collections' && urlPathSlugs[2] === 'publish'))
    ) {
      return {
        urlPathName: `${urlPathSlugs.join('/')}`,
        queryParams: queryStringObject
      };
    }

    // Check if the route is a build mode route. Also in go URL workspace appear as workspaces/workspace-id instead of workspace/workspace-id
    else if (urlPathSlugs[0] === 'workspaces' || validWorkspaceEntities.includes(urlPathSlugs[0])) {
      if (isPublicWorkspace) {
        let publicHandle = await _getCurrentPublicHandle(urlPathSlugs[1]);
        urlPrefix = publicHandle + '/';
      }

      // The dashboard entities can end with 's' but in artemis those entities don't end with 's'. For example - in dashboard collections while in artemis it's collection
      if (urlPathSlugs[0].slice(-1) === 's') {
        urlPathSlugs[0] = urlPathSlugs[0].slice(0, -1);
      }

      // When the dashboard links path start with an entity then transform the link
      if (urlPathSlugs[0] !== 'workspace') {

        if (queryStringObject.workspace) {
          // Pick the workspace information from query string and delete the workspace entry from query string object
          urlPrefix = `${urlPrefix}workspace/${queryStringObject.workspace}/`;
          delete queryStringObject.workspace;
        } else {
          isCanonicalURL = true;
        }

        // For pull requests route collection/collection-id/pull-requests/id should be converted to just pull-requests/id as per new route mapping
        if (urlPathSlugs.length > 2 && urlPathSlugs[0] === 'collection' && urlPathSlugs[2] === 'pull-requests') {
          urlPathSlugs = urlPathSlugs.slice(2);
          urlPathSlugs[0] = 'pull-request';
        }

        // For annotation comments, the URL will come as - dashboardUrl/collections/collection-id?comment=comment-id&anchor=request/request-id
        // We don't need the collection part here, just anchor and comment id
        else if (urlPathSlugs.length > 1 && urlPathSlugs[0] === 'collection' && queryStringObject.anchor) {
          // TO DO : remove this owner id extraction from collection id once it's handled inside collaboration handler

          // The request id received from dashboard URL does not contain the owner ID but the canonical handler expect the full uid
          // Hence as a workaround extracting the owner ID from collection id and appending it with request id
          let uidParts = urlPathSlugs[1].split('-'),
            requestSlugs = queryStringObject.anchor.split('/'),
            requestId = requestSlugs.length > 1 && `${uidParts[0]}-${requestSlugs[1]}`;
          mainURL = `${requestSlugs[0]}/${requestId}`;
          delete queryStringObject.anchor;
        }

        // For API, the version information can be passed in query string. In the corresponding artemis URL - the version should be added as sub route
        else if (urlPathSlugs[0] === 'api' && queryStringObject.version) {
          urlSuffix = `/version/${queryStringObject.version}`;
          delete queryStringObject.version;
        }
      }
    }

    // For public workspaces we register BASE_PATH (which is publicHandle for public workspaces) along with the full path.
    // So in case when we encounter link from private context on public workspaces we need to also
    // add the publicHandle while transforming the URL. One such example of the consumer is WorkspaceActivityFeed
    else if (isPublicWorkspace) {
      let publicHandle;

      // When the URL contains /build we can directly assign publicHandle in its place as we don't use
      // /build as the BASE_PATH anymore. Example: go.postman.co/build/workspace/:wid/api/:id -> www.postman.com/:publicHandle/workspace/:wid/api/:id
      if (urlPathSlugs[0] === 'build' && urlPathSlugs[1] === WORKSPACE && urlPathSlugs.length > 2) {
        publicHandle = await _getCurrentPublicHandle(urlPathSlugs[2]);
        urlPathSlugs[0] = publicHandle;
      }

      // When the URL starts with WORKSPACE we can't directly assign publicHandle here as we need
      // the full path as it is. Therefore we can prepend publicHandle instead.
      // Example: go.postman.co/workspace/:wid/api/:id -> www.postman.com/:publicHandle/workspace/:wid/api/:id
      else if (urlPathSlugs[0] === WORKSPACE) {
        publicHandle = await _getCurrentPublicHandle(urlPathSlugs[1]);
        urlPathSlugs.unshift(publicHandle);
      }

      // When the URL is for canonical route then need to insert the public handle so that route matching algorithm matches the rout
      else {

        // Following entities are valid canonical route entities
        // Adding this extra fail safe so that no unintentional public handle insertion happens for other routes
        const VALID_CANONICAL_ENTITIES = new Set(['api', 'documentation', 'request', 'example', 'environment', 'collection', 'folder']);

        // The public handle will be anyway determined inside the canonical handler
        // We are just inserting the current public handle so that route matching algorithm works in this case
        publicHandle = _getCurrentPublicHandle();

        // In some cases the 'build' is still prefixed, we need to replace such links with public handle
        if (urlPathSlugs[0] === 'build' && urlPathSlugs.length > 1 && VALID_CANONICAL_ENTITIES.has(urlPathSlugs[1])) {
          urlPathSlugs[0] = publicHandle;
        } else if (VALID_CANONICAL_ENTITIES.has(urlPathSlugs[0])) {
          urlPathSlugs.unshift(publicHandle);
        }
      }
    }
  }

  // in some cases the main URL is completely replaced
  // for example collection/:cid?anchor=request/:rid -> here collection/:cid is completely replaced by request/:rid
  if (_.isEmpty(mainURL)) {
    mainURL = urlPathSlugs.join('/');
  }

  return {
    urlPathName: `${urlPrefix}${mainURL}${urlSuffix}`,
    queryParams: queryStringObject,
    hashFragment,
    isCanonicalURL
  };
}

/**
 * Decode the route params object
 * @param {Object} routeParams
 */
function _decodeRouteParams (routeParams) {
  let decodedParams = {};

  Object.entries(routeParams).forEach(([key, value]) => decodedParams[key] = decodeURIComponent(value));

  return decodedParams;
}

/**
 * Sanitize the URL for comparison
 * @param {String} url
 */
function _sanitizeURL (url) {
  let sanitizedURL = removeFriendlySlugs(url),
    sanitizedURLSlugs = sanitizedURL.split('/'),
    validSlugs = sanitizedURLSlugs.filter((slug) => !_.isEmpty(slug));

  return validSlugs.join('/');
}

const NavigationService = {
  /**
   * Initialize navigation service.
   */
  initialize (app, locationService) {
    // @todo move the URL specific logic to location service later

    // set up an observable variable to track current URL
    this.currentURL = observable.box(null);

    // update the current url in observable store
    this._setObservableCurrentUrl = action((url) => {
      this.currentURL.set(url);
    });

    // Boolean representing if a navigation is currently active
    this._isNavigationActive = false;

    // Starting time for the current navigation
    this._currentNavigationStart = null;

    // Holds the presently active state of navigation
    this._activeState = null;

    this.locationService = locationService;
    this.locationService.init(app);

    // Disable route auditing as it falsely report route conflict even when routes are under different parent
    // Ideally we should move route auditing to a non blocking place
    // _auditRoutes();
    this._initWhitelistedDomains();
    pm.logger.info('NavigationService ~ Initialized: Success');
  },

  _initWhitelistedDomains () {
    // Get base URL of current site
    const CURRENT_BASE_URL = NavigationService.getBaseURL(),
      POSTMAN_EXPLORE_URL = pm.config && pm.config.get('__WP_EXPLORE_URL__'),
      POSTMAN_PRELOGIN_PURCHASE_URL = pm.config && pm.config.get('__WP_PRELOGIN_PURCHASE_URL__');

    // Whitelisted URLs for internal transition
    // If the domain is different than these whitelisted URLs then external navigation will take place
    // As of now artemis url is same as dashboard url and for desktop artemis url is undefined
    // But this is included just for future compatibility so that if at any point of time artemis url becomes something other than go link, openURL API should not break the transitions
    // Also present domain is supported for internal transition
    // This is done so that if anyone provides a link - https://www.cooper.postman.co/workspace/id while on cooper, this call should be treated as internal transition, although we do suggest transitionTo API for such cases
    const whiteListedUrls = _.compact([pm.dashboardUrl, POSTMAN_EXPLORE_URL, POSTMAN_PRELOGIN_PURCHASE_URL, pm.artemisUrl, CURRENT_BASE_URL]);
    this._whitelistedDomains = {
      // Whitelisted domains to consider internal transition
      // When any of the following domains will be received in openURL API, we will further check for a possibility of internal transition
      INTERNAL_TRANSITION_WHITELISTED_DOMAINS: _getOriginsFromUrl(whiteListedUrls, (url) => { pm.logger.info(`NavigationService ~ openURL: ${url} invalid URL was blocked from being whitelisted`); }),

      // Domain which will need an authentication handover from desktop to browser
      AUTH_HANDOVER_WHITELISTED_DOMAINS: _getOriginsFromUrl([pm.dashboardUrl], (url) => { pm.logger.info(`NavigationService ~ openURL: ${url} invalid URL was blocked from being whitelisted for authentication handover`); })
    };
  },

  /**
   * Determine if URL needs authentication, this is only needed for desktop. When an intent is not fulfilled within the app, the link is opened in the browser tab
   * This method determines if a authentication handover token should be created for the link
   * @param {*} url
   */
  _doesURLNeedAuthentication (url) {
    if (!url || window.SDK_PLATFORM === 'browser') {
      return false;
    }

    const targetURL = new URL(url);

    // As of now, only dashboard links are whitelisted
    // All dashboard links will have a handover token attached to it when opening from app to browser
    return this._whitelistedDomains.AUTH_HANDOVER_WHITELISTED_DOMAINS.has(targetURL.origin);
  },

  /**
   * Get the alias pattern from route and alias identifier
   * @param {Object} route
   * @param {String} aliasIdentifier
   */
  _getRouteAliasPattern (route, aliasIdentifier) {
    if (aliasIdentifier) {
      let alias = route.aliases.find((alias) => alias.name === aliasIdentifier);
      return alias && alias.pattern;
    }
  },

  /**
   * Construct the full route pattern and params
   * @param {String} routeIdentifier
   * @param {Object} routeParams
   * @param {String} aliasIdentifier
   */
  _getFullRoutePathAndParams (routeIdentifier, routeParams, aliasIdentifier) {
    let route = _findRouteByName(routeIdentifier);

    if (!route) {
      pm.logger.error('NavigationService ~ transitionTo: No Route found with this name: ', routeIdentifier);
      return;
    }

    // @todo: add validation here if route param is expected but not provided

    // If the transition is made with an alias then get the proper alias pattern, otherwise use the main pattern
    let routePattern;
    if (window.SDK_PLATFORM === 'browser') {
      routePattern = route.url;
    } else {
      routePattern = this._getRouteAliasPattern(route, aliasIdentifier) || route.url;
    }

    let urlParts = [routePattern],
      matches = [],
      activeRouteParams = {};

    // Get currently active routes and route parameters
    const matchedRouteAndParams = this._getActiveRouteAndParams();

    if (!_.isEmpty(matchedRouteAndParams)) {
      matches = matchedRouteAndParams.matches;
      activeRouteParams = matchedRouteAndParams.routeParams;
    }

    // traverse till parent is null and construct the full route pattern
    while (route.parentName) {
      route = _findRouteByName(route.parentName);

      // By default initialize with main route pattern
      let parentRoutePattern = route.url;

      // For finding parent route pattern, give preference to existing matched routes for the current URL
      // If any of the parent route used alias pattern, instead of main pattern then make sure corresponding navigation also respects the parent alias pattern
      let matchedParentRoute = matches.find((match) => match.name === route.name);
      if (matchedParentRoute) {
        parentRoutePattern = matchedParentRoute.matchedPattern;
      }

      urlParts.unshift(parentRoutePattern);
    }

    return {
      routePath: urlParts.join('/'),

      // Merge currently active route params with new intent route params
      // The new value should override the previous values i.e. currently active values
      // But route params which are not present in intent route should be picked from currently active route params
      routeParams: Object.assign(activeRouteParams, routeParams)
    };
  },

  /**
   * Get current route params
   */
  getCurrentRouteParams () {
    const matchedRouteAndParams = this._getActiveRouteAndParams();

    return _.isEmpty(matchedRouteAndParams) ? {} : matchedRouteAndParams.routeParams;
  },

  /**
   * Get active routes and corresponding route params
   */
  _getActiveRouteAndParams () {
    const currentUrl = this.locationService.getCurrentURL();

    if (!currentUrl) {
      return {};
    }

    const { pathUrl: appURL } = getUrlParts(currentUrl),
      matches = _findURLMatches(appURL),
      routeParams = matches.reduce((params, match) => {
        !_.isEmpty(match.params) && Object.assign(params, match.params);
        return params;
      }, {});

    return {
      matches,
      routeParams: _decodeRouteParams(routeParams) // Decode the route params as it may be encoded in the URL
    };
  },

  /**
   * Construct the URL from route
   * @param {String} routeIdentifier
   * @param {Object} routeParams
   * @param {Object} queryParams
   * @param {String} hashFragment
   * @param {String} aliasIdentifier
   */
  getURLForRoute (routeIdentifier, routeParams, queryParams, hashFragment, aliasIdentifier) {
    const routeDetails = NavigationService._getFullRoutePathAndParams(routeIdentifier, routeParams, aliasIdentifier);

    if (!routeDetails) {
      return;
    }

    // routeDetails.routeParams contains the merged route params - all existing route params merged with the route params passed to this function
    // Route params passed to this function takes higher precedence so that if same route is active in current URL then the route params passed to this function overrides the route params in current URL
    return constructUrl(routeDetails.routePath, routeDetails.routeParams, queryParams, hashFragment);
  },

  /**
   * Transition to a specific route by route identifier
   * @param {String} routeIdentifier namespaced route identifier, for example - if a workbench item is registered in manifest with the name 'sample' then route identifier will be 'build.sample' as workbench is under build construct
   * @param {Object} routeParams key-value pairs containing all route params as key. When registering a route the dynamic part is provided by prefixing ':' followed by a placeholder name. This is called route params. Example - if 'sample/:sid' is registered as route then routeParams object will be { sid: 'some-id' }
   * @param {Object} queryParams key-value pairs of query parameters
   * @param {Object} options Object containing various categories of options
   * @param {String} hashFragment the hash fragment
   * @property {String} aliasIdentifier If the URL should be constructed using one of the aliases rather than the main registered pattern, then mention the alias name
   */
  transitionTo (routeIdentifier, routeParams, queryParams, options, hashFragment, aliasIdentifier) {
    let resolvedUrl = NavigationService.getURLForRoute(routeIdentifier, routeParams, queryParams, hashFragment, aliasIdentifier);

    if (!resolvedUrl && !_requesterInitialized && window.SDK_PLATFORM === 'browser') {
      return _initializeRequesterLegacy().then(() => {
        return this.transitionTo(routeIdentifier, routeParams, queryParams, options, hashFragment, aliasIdentifier);
      });
    } else {
      if (!resolvedUrl) {
        pm.logger.error('NavigationService~transitionTo: invalid route ', routeIdentifier);
        return;
      }

      return NavigationService.transitionToURL(resolvedUrl, {}, options);
    }
  },

  /**
   * If a particular route is active - returns an observable boolean
   * @param {String} routeIdentifier namespaced route identifier, for example - if a workbench item is registered in manifest with the name 'sample' then route identifier will be 'build.sample' as workbench is under build construct
   * @param {Object} routeParams key-value pairs containing all route params as key. When registering a route the dynamic part is provided by prefixing ':' followed by a placeholder name. This is called route params. Example - if 'sample/:sid' is registered as route then routeParams object will be { sid: 'some-id' }
   * @param {Object} queryParams key-value pairs of query parameters
   * @returns an observable boolean
   */
  isActive (routeIdentifier, routeParams, queryParams, options = {}, aliasIdentifier) {
    return NavigationService._getBoxedActiveStatus(routeIdentifier, routeParams, queryParams, options, aliasIdentifier).get();
  },

  /**
   * Get a boxed observable depicting active status of a route
   * @param {String} routeIdentifier
   * @param {String} routeParams
   * @param {String} queryParams
   */
  _getBoxedActiveStatus (routeIdentifier, routeParams, queryParams, options, aliasIdentifier) {
    return computed(() => {

      if (!queryParams) {
        queryParams = {};
      }

      const currentURL = NavigationService.currentURL.get();
      let currentURLParts, currentURLPathName, currentURLQueryParams, routeURL, sanitizedRouteURL, sanitizedCurrentURL;

      // If computed is accessed before URL systems are initialised
      if (!currentURL) {
        return false;
      }

      currentURLParts = getUrlParts(currentURL);
      currentURLPathName = currentURLParts.pathUrl;
      currentURLQueryParams = _getQueryStringParams(currentURLParts.queryString);

      // If query parameters are present then first check the query parameters and if they don't match just return false
      if (!_.isEqual(queryParams, currentURLQueryParams)) {
        return false;
      }


      if (options && options.exact) {
        const { routePath, routeParams: mergedRouteParams } = NavigationService._getFullRoutePathAndParams(routeIdentifier, routeParams, aliasIdentifier);
        routeURL = constructUrl(routePath, mergedRouteParams);
        sanitizedRouteURL = _sanitizeURL(routeURL);
        sanitizedCurrentURL = _sanitizeURL(currentURLPathName);

        return sanitizedCurrentURL === sanitizedRouteURL;
      } else {
        // Get all routes matching current URL, this method returns an array starting from base route to all sub routes
        const matchedRoutes = _findURLMatches(currentURLPathName),
          matchedRoute = matchedRoutes.find((route) => route.name === routeIdentifier);

        // If the route identifier is not found in the matched routes then return false
        if (!matchedRoute) {
          return false;
        }

        routeURL = constructUrl(matchedRoute.matchedPattern, routeParams);
        sanitizedRouteURL = _sanitizeURL(routeURL);
        sanitizedCurrentURL = _sanitizeURL(currentURLPathName);

        // route url can be matched at any position of current URL
        return sanitizedCurrentURL.includes(sanitizedRouteURL);
      }
    });
  },

  /**
   * Get active query params
   * @returns observable object of current query parameters
   */
  getActiveQueryParams () {
    return NavigationService._getBoxedActiveQueryParams();
  },

  /**
   * Get boxed active query params
   */
  _getBoxedActiveQueryParams () {
    return computed(() => {
      const currentURL = NavigationService.currentURL.get();

      // If computed is accessed before URL systems are initialised
      if (!currentURL) {
        return;
      }

      const currentURLParts = getUrlParts(currentURL),
        currentURLQueryParams = _getQueryStringParams(currentURLParts.queryString);

      return currentURLQueryParams;
    });
  },

  /**
   * Get active hash fragment
   * @returns observable string of current hash fragment
   */
  getActiveHashFragment () {
    return NavigationService._getBoxedActiveHashFragment().get();
  },

  /**
   * Get boxed active hash fragment
   */
  _getBoxedActiveHashFragment () {
    return computed(() => {
      const currentURL = NavigationService.currentURL.get();

      // If computed is accessed before URL systems are initialised
      if (!currentURL) {
        return;
      }

      const currentURLParts = getUrlParts(currentURL),
        currentURLQueryParams = currentURLParts.hashFragment && decodeURIComponent(currentURLParts.hashFragment);

      return currentURLQueryParams;
    });
  },

  /**
   * Set active state of navigation
   * @param {Array} matchedRoutes matched routes
   */
  _setActiveState (matchedRoutes) {
    this._activeState = {
      matchedRoutes
    };
  },

  /**
   * Get the current active state of navigation
   */
  getActiveState () {
    return this._activeState;
  },

  async transitionToInitialURL () {
    let initURL = await this.getInitialURL();

    pm.logger.info('NavigationService ~ [BROWSER] Transitioning io the initial route with the URL:', initURL);
    return this.transitionToURL(initURL);
  },

  register (name, url, handler, parentName, view, aliases) {
    let newRoute = new Route(name, url, handler, parentName, view, aliases);

    if (_findRouteByName(name)) {
      pm.logger.error('NavigationService~register- A route already registered for this intent. Duplicate routes not supported.');
      return;
    }

    _routes.push(newRoute);
    return newRoute;
  },

  /**
   * @method transitionTo
   * @description  This function is called to trigger a navigation.
   * @param {String} url
   * @param {boolean} push If the URL should be pushed to the browser history
   */
  transitionToURL (url, params, options) {
    this._markNavigationStart();

    let { pathUrl, queryString, hashFragment } = getUrlParts(url);

    // If transition URL is blank then we navigate to default route - '/' which is basically the home page
    if (!pathUrl) {
      pathUrl = '/';
    }

    let queryParams = _getQueryStringParams(queryString),
      matches = _findURLMatches(pathUrl);

    hashFragment = hashFragment && decodeURIComponent(hashFragment);

    if ((!matches || !matches.length) && !_requesterInitialized && window.SDK_PLATFORM === 'browser') {
      return _initializeRequesterLegacy().then(() => {
        return this.transitionToURL(url, params, options);
      });
    } else {
      // Check if any matches found for default route '/'
      // Otherwise fallback to 'home' route as failsafe
      if (matches.length === 0 && pathUrl === '/') {
        matches = _findURLMatches('home');

        // Along with the match we also need to update the URL, otherwise the current URL would point to a wrong value
        // The matched base route should never be undefined at this point
        // But still checking to avoid javascript errors on console in case both '/' and 'home' route are erroneously removed from manifest
        if (matches.length > 0) {
          url = constructUrl('home', {}, queryParams, hashFragment);
        }
      }

      this.updateCurrentURL(url, options);
      let transition = new Transition(url, params, queryParams, hashFragment, matches, options);

      return transition.begin()
        .finally(() => {
          this._markNavigationEnd();
          this._setActiveState(matches);
          window.dispatchEvent(activeNavigationCompleteTransition);
        });
    }
  },

  setURL (routeName, routeParams, queryParams) {
    let resolvedUrl = NavigationService.getURLForRoute(routeName, routeParams, queryParams);

    if (!resolvedUrl) {
      pm.logger.error('NavigationService~setURL: invalid route ', routeName);
      return;
    }

    // push the new URL to history only if it is different from the current URL.
    this.updateCurrentURL(resolvedUrl);
  },

  unsetURL (routeName) {
    let route = _findRouteByName(routeName);
    if (!route) {
      pm.logger.error('NavigationService ~ unSetURL: No Route found with this name: ', routeName);
      return;
    }
    let parentURL = route.parentName ? route.getParentUrl() : '';

    let newURL = parentURL ? parentURL : '';
    this.updateCurrentURL(newURL);
  },

  updateURL (routeName, newRouteParams) {
    /**
     * TO DO: Redesign the API. We need to understand the specific use cases and provide a more conceptually accurate API
     * rather than providing a generic API to update any URL slug.
     *
     * Note 1: Even if we update the URL slug, there's quite a bit optimization possible here
     * Instead of fetching active route and active route parameter from the URL,
     * if we always store the active route and route parameters whenever a successful transition is made
     * then this entire function can be simplified a lot
     * But we are not going ahead with the approach - we need to think through before making NavigationService stateful
     * Also updateURL API itself may be deprecated in favor of a more accurate API in near future
     *
     * Note 2: The routeName parameter at this moment serve no real purpose other than just a check to ensure user has provided
     * at least one valid route. But user can update other route's route param as well.
     */

    if (!NavigationService.getCurrentURL()) {
      return;
    }

    // Find all matching routes and route parameters for the current URL
    const activeRoutesAndRouteParams = this._getActiveRouteAndParams();

    // If matching route and route params are not available, bail out
    if (_.isEmpty(activeRoutesAndRouteParams)) {
      return;
    }

    const { matches: activeRoutes, routeParams: currentRouteParams } = activeRoutesAndRouteParams,

      // Check if the provided route name is one of the active route or not
      matchedRoute = activeRoutes.filter((route) => route.name === routeName);

    // If user provided route is not active then bail out
    if (!matchedRoute) {
      return;
    }

    // Merge the new route params with current route params, so that new route param value overrides the current value
    const updatedRouteParams = Object.assign({}, currentRouteParams, newRouteParams),

      // TO DO: Presently for getActiveQueryParams API, we need to call get(). The API will be fixed in WEBFN-216
      queryParams = this.getActiveQueryParams().get(),
      hashFragment = this.getActiveHashFragment(),

      // Form the new URL
      // While forming the new URL, the last active matched route's route identifier is used. This will properly form the entire URL traversing through parent routes
      updatedURL = NavigationService.getURLForRoute(activeRoutes[activeRoutes.length - 1].name, updatedRouteParams, queryParams, hashFragment);

    if (!updatedURL) {
      return;
    }

    // Update current URL by replacing the current history entry
    this.updateCurrentURL(updatedURL, { replace: true });
  },

  getRoutesForURL (url) {
    let matches = _findURLMatches(url);
    return matches.map((match) => {
      return {
        name: match.name,
        matchedAliasId: match.matchedAliasId,
        view: _findRouteByName(match.name).getView(),
        routePattern: match.url,
        url: match.matchUrl,
        routeParams: match.params
      };
    });
  },

  /**
   * Get all direct sub routes of a route
   * @param {String} routeIdentifier The parent route identifier
   */
  getSubRoutes (routeIdentifier) {
    return _routes.reduce((matches, currentRoute) => {
      currentRoute.parentName === routeIdentifier && matches.push(currentRoute);
      return matches;
    }, []);
  },

  getMatchingRouteForURL (urlSlug) {
    for (let route of _routes) {
      let result = _matchPath(urlSlug, {
        path: route.url,
        exact: true
      });
      if (result) {
        return {
          view: _findRouteByName(route.name).getView(),
          url: result.url,
          routePattern: result.path,
          routeParams: result.params
        };
      }
    }

    return null;
  },

  /**
   * Get the current URL
   */
  getCurrentURL () {
    // Location service is initialized when the application itself is initialized
    // Hence the check for unsafe property access is not needed
    return NavigationService.locationService.getCurrentURL();
  },

  /**
   * Get the base URL
   */
  getBaseURL () {
    return NavigationService.locationService.getBaseURL();
  },

  updateCurrentURL (newURL, options) {
    options = options || {};
    this._setObservableCurrentUrl(newURL);
    let { pathUrl } = getUrlParts(newURL);
    options.matchedRoutes = NavigationService.getRoutesForURL(pathUrl);
    this.locationService.updateCurrentURL(newURL, options);
  },

  getInitialURL () {
    return Promise.resolve()
      .then(() => {
        return this.locationService.getInitialURL();
      });
  },

  /**
   * Open a URL - checks internally if the intent can be fulfilled by triggering a transition or web page load is needed
   * @param {String} url
   * @param {Object} options
   */
  async openURL (url, options) {

    if (!url) {
      return;
    }

    // If user specifically mentions that the link is to be opened in a new tab, do not check if the link is internal or external
    // Open a new tab by considering the link to be external anyway
    if (options && options.target === '_blank') {
      NavigationService._openExternalURL(url, options);
      return;
    }

    /**
     * If just a hash fragment is passed as URL then bailout
     */
    if (url.startsWith('#')) {
      return;
    }

    // @debt: Redirect the user profiles GO link to external public profiles , if it is enabled for
    // the given user.
    if (isServedFromPublicWorkspaceDomain()) {
      let publicProfileHandle = await this._getPublicProfileHandleFromGoLink(url);
      if (publicProfileHandle) {
        NavigationService.transitionTo(PUBLIC_PROFILE_PAGE, { publicProfileHandle: publicProfileHandle });
        return;
      }
    }

    let targetURL;

    // Check if the provided URL is valid
    // If an invalid URL is provided then log the error and bail out
    try {
      targetURL = new URL(url);
    } catch (err) {
      pm.logger.error(`NavigationService ~ openURL: ${url} URL is invalid`);
      return;
    }

    const targetURLPath = targetURL.pathname,
      targetUrlSlugs = targetURLPath.split('/'),

      // removing empty slugs created by '//' of url
      targetUrlValidSlugs = targetUrlSlugs.filter((slug) => !_.isEmpty(slug));

    // Attempt internal transition -
    // 1. If target URL origin is allowed for internal transition
    // 2. There are valid slugs available for route matching
    if (this._whitelistedDomains.INTERNAL_TRANSITION_WHITELISTED_DOMAINS.has(targetURL.origin) && targetUrlValidSlugs && targetUrlValidSlugs.length > 0) {
      let urlPathName, queryParams, hashFragment;

      // Transform the dashboard URL to artemis URL
      if (pm.dashboardUrl === targetURL.origin) {
        ({ urlPathName, queryParams, hashFragment } = await _transformDashboardURL(targetURL, targetUrlValidSlugs));
      } else {
        urlPathName = targetUrlValidSlugs.join('/');
        ({ queryParams, hashFragment } = _getQueryStringAndHashFragmentFromURL(targetURL));
      }

      // To enable '/build' to '/' redirection we have registered a handler for 'build' which
      // removes the '/build' from the URL path and transitions the URL accordingly. Also we have removed
      // 'build' as base path from every registered routes. As we have registered 'build' with NavigationService
      // any URL containing 'build' was only matching the 'build' handler. Example: go.postman.com/build/api/:apiId
      // would match 'build' handler. So we need to explicitly remove the 'build' part. So that go.postman.com/build/api/:apiId
      // would match api/:apiId.
      urlPathName = urlPathName.replace(BUILD_URL_REGEX, '');

      // get all matching routes for the URL
      let matchedRoutes = NavigationService.getRoutesForURL(urlPathName);


      // We bypass the publicProfile route match, if it is the only match as it is currently acting as a route
      // which matches for all urls. Due to this behaviour an incorrect url is being opening up.
      // For example, eg. go.postman.com/users/12345 matches with the publicProfile route, and the
      // the non-existent url is opened.
      if (matchedRoutes && matchedRoutes.length) {
        _.remove(matchedRoutes, (route) => { return route.name && route.name === PUBLIC_PROFILE_PAGE; });
      }

      // If route matches then trigger a transition
      if (matchedRoutes && matchedRoutes.length > 0) {
        let urlToNavigate = urlPathName;
        if (!_.isEmpty(queryParams)) {
          urlToNavigate = `${urlToNavigate}?${_getQueryParamsString(queryParams)}`;
        }

        if (!_.isEmpty(hashFragment)) {
          urlToNavigate = `${urlToNavigate}#${hashFragment}`;
        }
        NavigationService.transitionToURL(urlToNavigate);
        return;
      }
    }

    // If the intent can not be fulfilled by internal transition then trigger a page load
    NavigationService._openExternalURL(url, options);
  },

  async _getPublicProfileHandleFromGoLink (url) {
    let publicProfileHandle = null;

    // matches go.postman.co/users/12345
      // will not match go.postman.co/users || go.postman.co/users/
      // expected groups
      // #1 full match
      // #2 match for beta/stage
      // #3 match for user id
      let userGoLinkRegex = new RegExp(/go.postman(-beta|-stage)?.co\/users\/([\w-]+)/);
      let match = userGoLinkRegex.exec(url);
      let userId = match && match[2];
      if (userId) {
        try {
          let response = await fetchUserPublicProfile(PUBLIC_PROFILE_TYPE_USER, [userId]);
          const userData = _.get(response, ['users', userId]);

          // if the user has a public profile enabled, we redirect to that public handle
          if (userData && userData.is_public) {
            try {
              let publicURL = new URL(userData.public_handle);
              publicProfileHandle = publicURL && publicURL.pathname;
              if (publicProfileHandle && publicProfileHandle.startsWith('/')) {
                publicProfileHandle = publicProfileHandle.substring(1);
              }
            }
            catch (e) {
              pm.logger.error('NavigationService ~ _getPublicProfileHandleFromGoLink: Incorrect public profile handle : ', userData.public_handle);
            }
          }
        }
        catch (e) {
          pm.logger.error('NavigationService ~ _getPublicProfileHandleFromGoLink: Error in fetchUserPublicProfile : ', e);
        }
      }

    return publicProfileHandle;
  },

  /**
   * Open an external URL i.e. URL that cannot be handled by internal navigation
   *
   * @param {String} url
   * @param {Object} options
   */
  _openExternalURL (url, options = {}) {
    if (!url) {
      return;
    }

    // If we are on the browser, open the external link. This does not require any
    // special handling for auth as the browser already has the user session
    if (window.SDK_PLATFORM === 'browser') {
      openExternalLink(url, options.target);
      return;
    }

    // Now, for the case of desktop, if it is an authenticated route - We need to create
    // a handover flow. Else, we can just trigger an external link open

    let isAuthenticatedRoute = this._doesURLNeedAuthentication(url);

    if (isAuthenticatedRoute) {
      const handoverToken = uuidV4();

      let userDetails = CurrentUserDetailsService.getCurrentUserDetails();

      createHandover(handoverToken, url);

      openExternalLink(getHandoverRoute({
        id: _.get(userDetails, 'userId')
      }, handoverToken), options.target);
    }
    else {
      openExternalLink(url, options.target);
    }
  },

  /**
   * Returns a boolean representing whether a navigation is active or not
   */
  isNavigationActive () {
    return this._isNavigationActive;
  },

  /**
   * Returns a timestamp denoting the starting time for the current navigation
   */
  getCurrentNavigationStartTime () {
    return this._currentNavigationStart;
  },

  /**
   * Marks the start of a navigation -
   * 1) We set the _currentNavigationStartTime to the current time
   * 2) We set the _isNavigationActive flag to true
   */
  _markNavigationStart () {
    this._currentNavigationStart = Date.now();
    this._isNavigationActive = true;
  },

  /**
   * Marks the end of a navigation -
   * Sets the _isNavigationActive flag to false
   */
  _markNavigationEnd () {
    this._isNavigationActive = false;
  }
};


class Transition {

  _alive = true;

  constructor (url, params, queryParams, hashFragment, matches, options = {}) {
    this.url = url;

    this.queryParams = queryParams;
    this.hashFragment = hashFragment;
    this.matches = matches;
    this.routeParams = params;
    this.options = options;

    // Update the current URL in NavigationService's observable variable
    NavigationService._setObservableCurrentUrl(url);
  }

  abort () {
    this._alive = false;
  }

  begin () {
    return this.matches.reduce((acc, match) => {
      return acc.then(() => {
        if (!this._alive) {
          match && pm.logger.error('Navigation Service - Transition aborted');
          throw new Error('Navigation Error');
        }

        return Promise.resolve()
          .then(() => {
            return match.handler({ ...match.params, ...this.routeParams }, this.queryParams, this, this.hashFragment);
          })

          .catch((err) => {
            match && pm.logger.error(`Navigation Service - Failed to transition into the route ${match.matchUrl}`, err);
            throw new Error('Navigation Error');
          });
        });
    }, Promise.resolve());
  }
}

class Route {
  constructor (name, url, handler, parentName = null, view, aliases = []) {
    this.name = name;
    this.url = url;
    this.handler = handler;
    this.parentName = parentName;
    this.view = view;
    this.aliases = aliases;
  }

  getView () {
    if (this.view) {
      return this.view;
    }

    if (this.parentName) {
      let parentRoute = _findRouteByName(this.parentName);
      if (!parentRoute) {
        return null;
      } else {
        let parentView = parentRoute.getView();
        return parentView === EDITOR_TAB || EDITOR_SUB_VIEW ? EDITOR_SUB_VIEW : parentView;
      }
    }
  }

  getUrl (params) {
    let url = this.url;
    for (let param in params) {
      url = url.replace(`:${param}`, params[param]);
    }
    return url;
  }

    /** Returns the registered route path from root to immediate parent */
  _getParentPath () {
    let parentRoute = _findRouteByName(this.parentName);
    if (!parentRoute) {
      return '';
    }

    return (parentRoute._getParentPath() + '/' + parentRoute.url);
  }

  _getParentPaths (urlAndAliases) {

    let parentRoute = _findRouteByName(this.parentName);
    if (!parentRoute) {
      return urlAndAliases;
    }

    let urlPaths = [],
      aliasPaths = [];

    urlAndAliases.forEach((value) => {
      urlPaths.push(`${parentRoute.url}/${value}`);

      parentRoute.aliases.forEach((alias) => {
        aliasPaths.push(`${alias.pattern}/${value}`);
      });

    });

    return parentRoute._getParentPaths([...urlPaths, ...aliasPaths]);
  }

  /** Returns the registered route path from root to self */
  getFullPaths () {
    const urlAndAliases = [this.url, ..._getAliasPatterns(this.aliases)];
    return this.parentName ? this._getParentPaths(urlAndAliases) : urlAndAliases;
  }


  /**
   * Extracts the parentUrl from the currentUrl for the route
   * It is used by the setURL method to generate a URL for a route. The route's URL is appended after the parentUrl.
   */
  getParentUrl () {
    let parentPath = this._getParentPath().substring(1);
    let currentURL = NavigationService.locationService.getCurrentURL();
    let { pathUrl: appURL } = getUrlParts(currentURL);
    let slugs = appURL.split('/');
    let found;
    [...slugs, ''].reduce((accumulator, current) => {
      let result = _matchPath(accumulator, {
        path: parentPath,
        exact: true
      });

      if (result) {
        found = result;
      }

      return current ? accumulator + '/' + current : accumulator;
    });
    return found ? found.url : '';

  }
}

export default NavigationService;
