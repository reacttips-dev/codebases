import user from 'js/lib/user';
import EnterpriseAdminRolesV1 from 'bundles/naptimejs/resources/enterpriseAdminRoles.v1';
import {
  HELP_CENTER_LINK,
  WES_HELP_CENTER_LINK,
  DS_HELP_CENTER_LINK,
} from 'bundles/program-common/constants/ProgramLinks';
import uniq from 'lodash/uniq';

const { ROLES } = EnterpriseAdminRolesV1;

const ENTERPRISE = 'ENTERPRISE';

export class EnterpriseAdminUser {
  roles: EnterpriseAdminRolesV1[] = [];

  contractType?: string;

  isFreemiumOrg = false;

  isC4CBOrg = false;

  isGwGOrg = false;

  isGwGFreemiumOrg = false;

  outsourcingPermissions: string[] = [];

  setRoles(roles: EnterpriseAdminRolesV1[] = [], privilegedAuth?: { outsourcingPermissions: string[] }): void {
    this.roles = roles;
    this.outsourcingPermissions = privilegedAuth?.outsourcingPermissions ?? [];
  }

  setContractType(contractType?: string): void {
    this.contractType = contractType;
  }

  isStandardContractUser(): boolean {
    return !this.contractType || this.contractType === 'STANDARD';
  }

  setIsFreemiumOrg(isFreemiumOrg: boolean): void {
    this.isFreemiumOrg = isFreemiumOrg;
  }

  setIsC4CBOrg(isC4CBOrg: boolean): void {
    this.isC4CBOrg = isC4CBOrg;
  }

  setIsGwGOrg(isGwGOrg: boolean): void {
    this.isGwGOrg = isGwGOrg;
  }

  setIsGwGFreemiumOrg(isGwGFreemiumOrg: boolean): void {
    this.isGwGFreemiumOrg = isGwGFreemiumOrg;
  }

  canEditProgram(programId?: string): boolean {
    if (!user.isAuthenticatedUser()) {
      return false;
    }

    if (this.canManageOrganization()) {
      return true;
    } else if (programId) {
      const isProgramAdmin = this.roles.some(
        (role) => role.managedLevelScope === `program~${programId}` && role.role === ROLES.PROGRAM_FULL
      );
      return isProgramAdmin;
    } else {
      return false;
    }
  }

  canManageOrganization(): boolean {
    const organizationAdminRole = this.roles.find(({ role }) => role === ROLES.ORGANIZATION_FULL);
    return !!(organizationAdminRole || this.isSuperUserOrEnterpriseOutsourcing());
  }

  canOnlyManagePrograms(): boolean {
    return !this.canManageOrganization() && this.roles.some(({ role }) => role === ROLES.PROGRAM_FULL);
  }

  getOrganizationIdsToManage() {
    return uniq(this.roles.map((_) => _.thirdPartyOrganizationId));
  }

  getProgramIdsToManage(): string[] {
    return uniq(
      this.roles
        .filter((_) => _.role === ROLES.PROGRAM_FULL)
        .map((_) => _.programId)
        .reduce((all, _) => (_ ? [...all, _] : all), [] as string[])
    );
  }

  hasEnterpriseOutsourcingPermission(): boolean {
    return this.outsourcingPermissions.some((perm) => perm === ENTERPRISE);
  }

  isSuperUserOrEnterpriseOutsourcing = (): boolean => {
    return this.hasEnterpriseOutsourcingPermission() || user.isSuperuser();
  };

  helpCenterLink(): string {
    switch (this.contractType) {
      case 'SELF_SERVE':
        return WES_HELP_CENTER_LINK;
      case 'STANDARD':
        return DS_HELP_CENTER_LINK;
      default:
        return HELP_CENTER_LINK;
    }
  }

  isCourserian() {
    return user.isCourserian();
  }
}
