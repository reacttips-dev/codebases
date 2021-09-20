import { RouteId } from './routes';

const cardRoutes = new Set<string>([RouteId.CARD, RouteId.CARD_OLD]);

export const isCardRoute = (routeId: RouteId): boolean =>
  cardRoutes.has(routeId);
