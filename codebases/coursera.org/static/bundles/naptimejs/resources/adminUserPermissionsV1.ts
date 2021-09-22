import NaptimeResource from './NaptimeResource';

class AdminUserPermissionsV1 extends NaptimeResource {
  static RESOURCE_NAME = 'adminUserPermissions.v1';

  permissions!: any;
}

export default AdminUserPermissionsV1;
