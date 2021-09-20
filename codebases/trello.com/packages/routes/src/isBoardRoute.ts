import { RouteId } from './routes';

const boardRoutes = new Set<string>([RouteId.BOARD, RouteId.BOARD_REFERRAL]);

export const isBoardRoute = (routeId: RouteId): boolean =>
  boardRoutes.has(routeId);
