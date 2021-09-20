import { useLocation } from '@trello/router';

import { getRouteIdFromPathname } from './getRouteIdFromPathname';
import { RouteId } from './routes';

export function useRouteId(): RouteId {
  const { pathname } = useLocation();
  return getRouteIdFromPathname(pathname);
}
