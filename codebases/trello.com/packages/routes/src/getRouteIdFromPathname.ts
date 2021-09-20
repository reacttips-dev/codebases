import { orderedRouteList, RouteId } from './routes';

/**
 * Returns the route id of a provided URL pathname. Will return undefined
 * if pathname does not match existing route regExp.
 *
 * @example
 * // returns 'powerUpPublicDirectory'
 * getRouteIdFromPathname('/power-ups');
 */
export const getRouteIdFromPathname = (path: string): RouteId => {
  const formattedPath = path.substr(1, path.length).replace(/\?(.*)$/, '');
  for (const route of orderedRouteList) {
    if (formattedPath.match(route.regExp)) {
      return route.id;
    }
  }

  throw new Error('Path name did not match any Route ID');
};
