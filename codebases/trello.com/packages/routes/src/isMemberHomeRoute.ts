import { RouteId } from './routes';

const memberHomeRoutes = new Set<string>([RouteId.MEMBER_HOME_BOARDS]);

export const isMemberHomeRoute = (routeId: RouteId): boolean =>
  memberHomeRoutes.has(routeId);
