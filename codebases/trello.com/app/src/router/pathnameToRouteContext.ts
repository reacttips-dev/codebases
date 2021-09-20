import { RouteContext } from './Router.types';
import { RouteNames } from './RouteNames';

export const pathnameToRouteContext = (
  pathname: string,
  origin: string = window.location.origin,
): RouteContext => {
  const firstPathSegment = pathname.split('/')[1];
  let routeName;
  let url = null;

  if (pathname === '/') {
    routeName = RouteNames.ROOT;
  } else if (firstPathSegment === 'b') {
    routeName = RouteNames.BOARD;
  } else if (firstPathSegment === 'c') {
    routeName = RouteNames.CARD;
  } else if (firstPathSegment === 'shortcuts') {
    routeName = RouteNames.SHORTCUTS;
  } else if (firstPathSegment === 'power-ups') {
    routeName = RouteNames.POWER_UPS;
  } else if (/^search/.test(firstPathSegment)) {
    routeName = RouteNames.SEARCH;
  } else {
    routeName = RouteNames.UNKNOWN;
  }

  // We have a quick-board route - i.e. "//board-name" - that will cause an
  // error if the route doesn't include a board name / search term (we can't
  // construct a URL instance from this because it's not valid). In that case,
  // we suppress the error and let the URL instance be null (the
  // quick-boards.js#quickBoard method will redirect back to "/")
  try {
    url = new URL(pathname, origin);
  } catch (e) {
    // We can't really do anything here... we need to retire the "//board-name"
    // routes, but that's a much larger problem.
  }

  return {
    routeName,
    routePath: pathname,
    url,
  };
};
