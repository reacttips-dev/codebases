const AdminRouteNames = {
  ADMIN: 'admin',
  COURSES: 'admin-courses',
  SPECIALIZATIONS: 'admin-specializations',
  GROUP: 'admin-group',
  MY_GROUP: 'admin-my-group',
  OTHER_GROUP: 'admin-other-group',
  INSTITUTIONS: 'admin-institutions',
  PROGRAMS: 'admin-programs',
} as const;

export default AdminRouteNames;

export type AdminRouteNamesValues = typeof AdminRouteNames[keyof typeof AdminRouteNames];

export const {
  ADMIN,
  COURSES,
  SPECIALIZATIONS,
  GROUP,
  MY_GROUP,
  OTHER_GROUP,
  INSTITUTIONS,
  PROGRAMS,
} = AdminRouteNames;
