import { getRouteIdFromPathname } from './getRouteIdFromPathname';
import { isOrganizationRoute } from './isOrganizationRoute';
import { routes } from './routes';

/**
 * Returns the organization name contained in a provided URL pathname.
 * Will return undefined if pathname is not an organization pathname
 * or if the pathname does not contain a organization name.
 *
 * @example
 * // returns 'teamplates'
 * getBoardShortLinkFromPathname('/teamplates/tables');
 */
export function getOrganizationNameFromPathname(pathname: string) {
  const routeId = getRouteIdFromPathname(pathname);
  const route = routes[routeId];

  if (!isOrganizationRoute(route.id)) {
    return undefined;
  }

  const [, orgname] = route.regExp.exec(pathname.slice(1)) ?? [];
  return orgname;
}
