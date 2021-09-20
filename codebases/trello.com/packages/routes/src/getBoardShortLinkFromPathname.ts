import { getRouteIdFromPathname } from './getRouteIdFromPathname';
import { routes, RouteId } from './routes';

/**
 * Returns the board shortlink contained in a provided URL pathname.
 * Will return undefined if pathname is not a board pathname
 * or if the pathname does not contain a shortlink.
 *
 * @example
 * // returns 'dSmI3Mww'
 * getBoardShortLinkFromPathname('/b/dSmI3Mww/board-name');
 */
export function getBoardShortLinkFromPathname(pathname: string) {
  const routeId = getRouteIdFromPathname(pathname);
  const route = routes[routeId];

  if (routeId !== RouteId.BOARD) {
    return undefined;
  }

  const [, shortLink] = route.regExp.exec(pathname.slice(1)) ?? [];
  return shortLink;
}
