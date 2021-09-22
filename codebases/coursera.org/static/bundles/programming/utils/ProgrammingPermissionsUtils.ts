import user from 'js/lib/user';

const hasAdminPrivileges = (hasTeachingRole?: boolean) => {
  return hasTeachingRole || user.isSuperuser();
};

export default { hasAdminPrivileges };
