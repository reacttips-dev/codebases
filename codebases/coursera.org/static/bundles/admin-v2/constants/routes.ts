import _t from 'i18n!nls/admin-v2';

import type Router from 'react-router';

export const BASE_PATH = '/admin-v2';

const AdminRouteNames = {
  HOME: 'home',
  COURSES: 'courses',
  PROGRAMS: 'programs',
  SPECIALIZATIONS: 'specializations',
  LEARNERS: 'learners',
  ANALYTICS: 'analytics',
  INSTITUTION: 'institution',
  SETTINGS: 'settings',
  ACCOUNT: 'account',
} as const;

export default AdminRouteNames;

export type AdminRouteNamesValues = typeof AdminRouteNames[keyof typeof AdminRouteNames];

type AdminRoute = {
  isHidden: boolean;
  href?: string;
  name: string;
  target: string;
  trackingName?: string;
  subItems?: Array<{
    name: string;
    target: string;
  }>;
};

export const getAdminV2Routes = (params: Router.Params): Array<AdminRoute> => {
  const { shortName } = params;

  return [
    {
      target: AdminRouteNames.HOME,
      href: `${BASE_PATH}/${shortName}/${AdminRouteNames.HOME}`,
      name: _t('Home'),
      isHidden: false,
      trackingName: 'admin_left_nav_home',
      subItems: [{ target: AdminRouteNames.COURSES, name: _t('Courses') }],
    },
    {
      target: AdminRouteNames.ANALYTICS,
      href: `${BASE_PATH}/${shortName}/${AdminRouteNames.ANALYTICS}`,
      name: _t('Analytics'),
      isHidden: false,
      trackingName: 'admin_left_nav_analytics',
    },
    {
      target: AdminRouteNames.INSTITUTION,
      href: `${BASE_PATH}/${shortName}/${AdminRouteNames.INSTITUTION}`,
      name: _t('Institution'),
      isHidden: false,
      trackingName: 'admin_left_nav_institution',
    },
  ];
};

export const {
  HOME,
  COURSES,
  PROGRAMS,
  SPECIALIZATIONS,
  LEARNERS,
  ANALYTICS,
  INSTITUTION,
  SETTINGS,
  ACCOUNT,
} = AdminRouteNames;
