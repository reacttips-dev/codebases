'use es6';

import PortalIdParser from 'PortalIdParser';
import * as CategorySlug from '../constants/urlSlugs/CategorySlug';
import * as SuperCategorySlug from '../constants/urlSlugs/SuperCategorySlug';
import { getCategorySuperCategory } from './groupTags';

var defaultPortalIdProvider = function defaultPortalIdProvider() {
  return PortalIdParser.get();
};

export var getSuperCategoryRoute = function getSuperCategoryRoute(superCategory) {
  var superCategorySlug = SuperCategorySlug[superCategory];

  if (!superCategorySlug) {
    throw new Error("Unable to find slug for super category '" + superCategory + "'");
  }

  return superCategorySlug;
};
export var getCategoryRoute = function getCategoryRoute(category, _superCategory) {
  var categorySlug = CategorySlug[category];

  if (!categorySlug) {
    throw new Error("Unable to find slug for category '" + category + "'");
  }

  var superCategory = _superCategory || getCategorySuperCategory(category);

  var superCategorySlug = getSuperCategoryRoute(superCategory);
  return superCategorySlug + "/" + categorySlug;
};

var getAppRouteBase = function getAppRouteBase(portalId) {
  return portalId ? "/ecosystem/" + portalId + "/marketplace/apps" : '';
};

export var makeGetAppStorefrontRoute = function makeGetAppStorefrontRoute() {
  var portalIdProvider = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultPortalIdProvider;
  return function (category, superCategory) {
    var query = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var portalId = portalIdProvider();
    var routeBase = getAppRouteBase(portalId);
    var routePrefix = getCategoryRoute(category, superCategory);
    return routeBase + "/" + routePrefix + query;
  };
};
export var makeGetAppDetailRoute = function makeGetAppDetailRoute() {
  var portalIdProvider = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultPortalIdProvider;
  return function (slug, category, superCategory) {
    var query = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var routePrefix;

    if (category) {
      routePrefix = makeGetAppStorefrontRoute(portalIdProvider)(category, superCategory);
    } else {
      var portalId = portalIdProvider();
      var routeBase = getAppRouteBase(portalId);
      routePrefix = routeBase + "/_detail";
    }

    return routePrefix + "/" + slug + query;
  };
};
export var getAppStorefrontRoute = makeGetAppStorefrontRoute();
export var getAppDetailRoute = makeGetAppDetailRoute();