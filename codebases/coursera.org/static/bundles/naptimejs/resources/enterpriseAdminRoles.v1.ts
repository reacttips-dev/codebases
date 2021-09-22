import NaptimeResource from './NaptimeResource';

class EnterpriseAdminRoles extends NaptimeResource {
  static RESOURCE_NAME = 'enterpriseAdminRoles.v1';

  static ROLES = {
    ORGANIZATION_FULL: 'ORGANIZATION_FULL',
    PROGRAM_FULL: 'PROGRAM_FULL',
  } as const;

  id!: string;

  role!: 'ORGANIZATION_FULL' | 'PROGRAM_FULL';

  managedLevelScope!: string;

  userId!: number;

  createdAt?: number;

  thirdPartyOrganizationId?: string;

  programId?: string;
}

export default EnterpriseAdminRoles;
