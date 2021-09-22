import type AdminPermission from 'bundles/admin/utils/AdminPermission';

import _t from 'i18n!nls/admin';
import type { AdminRouteNamesValues } from './AdminRouteNames';
import { COURSES, SPECIALIZATIONS, GROUP, MY_GROUP, INSTITUTIONS, PROGRAMS } from './AdminRouteNames';

type PageList = Array<{
  target: AdminRouteNamesValues;
  name: string;
  isHidden: boolean;
  trackingName?: string;
  href?: string;
}>;

const constants = () => ({
  adminPageList: [
    {
      target: COURSES,
      href: '/admin/courses',
      name: _t('Courses'),
      isHidden: true,
      trackingName: 'left_nav_courses',
    },
    {
      target: PROGRAMS,
      href: '/admin/programs',
      name: _t('Programs'),
      isHidden: true,
      trackingName: 'left_nav_programs',
    },
    {
      target: SPECIALIZATIONS,
      href: '/admin/specializations',
      name: _t('Specializations'),
      isHidden: true,
      trackingName: 'left_nav_specializations',
    },
    {
      target: INSTITUTIONS,
      href: '/admin/institutions',
      name: _t('Institution'),
      isHidden: true,
      trackingName: 'left_nav_institutions',
    },
    {
      target: GROUP,
      name: _t('Groups'),
      href: '/admin/groups',
      trackingName: 'left_nav_groups',
      isHidden: true,
      subItems: [{ target: MY_GROUP, name: _t('My Groups') }],
    },
  ],
});

const getAdminRoutes = (adminPermission: AdminPermission) => {
  const pageList: PageList = constants().adminPageList;

  const adminPageList = pageList.map((oldItem) => {
    const item = Object.assign({}, oldItem);
    switch (item.target) {
      case GROUP:
        item.isHidden = !adminPermission.canViewGroups();
        break;
      case COURSES:
        item.isHidden = !adminPermission.canViewCourses();
        break;
      case SPECIALIZATIONS:
        item.isHidden = !adminPermission.canViewS12n();
        break;
      case INSTITUTIONS:
        item.isHidden = !adminPermission.canViewInstitutions();
        break;
      case PROGRAMS:
        item.isHidden = !adminPermission.canViewDegrees();
        break;
      default:
        break;
    }
    return item;
  });
  return adminPageList;
};

export default constants;

export { getAdminRoutes };
