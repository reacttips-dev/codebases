import invariant from 'react-utils/invariant';

var segmentize = function segmentize(uri) {
  return uri.replace(/(^\/+|\/+$)/g, '').split('/').filter(Boolean);
};

var paramRe = /^:(.+)/;
export default (function (routes) {
  var routeSegmentsCache = {};
  routes.forEach(function (route) {
    routeSegmentsCache[route] = segmentize(route);
  });
  return function (route, pathname) {
    var pathnameSegments = segmentize(pathname);
    var routeSegments = routeSegmentsCache[route];
    invariant(routeSegments, "unexpected route " + route);

    if (routeSegments[routeSegments.length - 1] === '*' ? pathnameSegments.length < routeSegments.length : pathnameSegments.length !== routeSegments.length) {
      return false;
    }

    var index = 0;

    for (; index < routeSegments.length; index++) {
      var routeSegment = routeSegments[index];
      var pathnameSegment = pathnameSegments[index];

      if (routeSegment === '*' && index === routeSegments.length - 1) {
        return true;
      } else if (routeSegment !== pathnameSegment && !paramRe.exec(routeSegment)) {
        return false;
      }
    }

    return true;
  };
});