import { RouteId } from './routes';

const organizationRoutes = new Set<RouteId>([
  RouteId.WORKSPACE_DEFAULT_MY_WORK_VIEW,
  RouteId.WORKSPACE_VIEW,
  RouteId.WORKSPACE_DEFAULT_CUSTOM_TABLE_VIEW,
  RouteId.ACCOUNT,
  RouteId.BILLING,
  RouteId.MEMBER_CARDS_FOR_ORG,
  RouteId.ORGANIZATION_BY_ID,
  RouteId.ORGANIZATION_EXPORT,
  RouteId.ORGANIZATION_FREE_TRIAL,
  RouteId.ORGANIZATION_GUESTS,
  RouteId.ORGANIZATION_MEMBER_CARDS,
  RouteId.ORGANIZATION_MEMBERS,
  RouteId.ORGANIZATION_POWER_UPS,
  RouteId.ORGANIZATION_TABLES,
  RouteId.PROFILE,
  RouteId.USER_OR_ORG,
]);

export const isOrganizationRoute = (routeId: RouteId): boolean =>
  organizationRoutes.has(routeId);
