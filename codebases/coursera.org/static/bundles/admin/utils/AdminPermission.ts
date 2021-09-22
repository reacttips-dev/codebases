import _ from 'lodash';

import user from 'js/lib/user';
import { Partner } from 'bundles/admin/constants/types';
import { DATA_COORDINATOR, PARTNER_ADMIN } from 'bundles/common/constants/PartnerRoles';

class AdminPermission {
  userAccessPermissions: {};

  constructor(userAccessPermissions: { [key: string]: string }) {
    this.userAccessPermissions = userAccessPermissions;
  }

  canView(permission: string) {
    if (user.isSuperuser()) {
      return true;
    } else {
      for (const props in this.userAccessPermissions) {
        if (props.indexOf(permission) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  canViewCourses() {
    return this.canView('adminCourse');
  }

  canViewInstitutions() {
    return this.canView('adminInstitution');
  }

  canViewS12n() {
    return this.canView('adminS12n');
  }

  canViewDegrees() {
    return this.canView('adminDegree');
  }

  /* TODO: add better gating based off the group summaries response */
  canViewGroups() {
    return this.canView('adminGroup');
  }

  /* essentially if the user can do ANY admin functionality then they should see the link */
  canViewAdminLink() {
    return (
      this.canViewCourses() ||
      this.canViewInstitutions() ||
      this.canViewS12n() ||
      this.canViewDegrees() ||
      this.canViewGroups()
    );
  }

  canViewDegreeAsLearner(degreeId: string) {
    const degreeIdCheck = degreeId.replace('base~', 'instanceId~base!~');
    return this.canView(degreeIdCheck + `,name~adminDegree`);
  }

  canCreateGroup() {
    return this.canView('name~adminGroup,verb~create');
  }

  canCreateCourse(partnerId?: number) {
    /* For user with only 1 partner association, selectedPartnerId is never set. Adding checking only when we have value set */
    const instanceIdCheck = partnerId ? `instanceId~${partnerId},` : '';
    return this.canView(instanceIdCheck + `name~adminCourse,verb~create`);
  }

  canCopyCourse(partnerId?: number, courseId?: string) {
    const partnerIdCheck = partnerId ? `instanceId~${partnerId},` : '';
    const courseIdCheck = courseId ? `instanceId~${courseId},` : '';
    // This must be kept in sync with the BE logic as this is a derived permission.
    return (
      this.canView(courseIdCheck + `name~adminCourse,verb~update`) &&
      this.canView(partnerIdCheck + `name~adminCourse,verb~create`)
    );
  }

  canCreateGroupForCourse(courseId: string) {
    return this.canView(`instanceId~${courseId},name~adminGroup,verb~create`);
  }

  canCreateS12n(instanceId: number) {
    /* For user with only 1 partner association, selectedPartnerId is never set. Adding checking only when we have value set */
    const instanceIdCheck = instanceId ? `instanceId~${instanceId},` : '';
    return this.canView(instanceIdCheck + `name~adminS12n,verb~create`);
  }

  canAddInstructorForPartner(partners: Array<Partner>) {
    const allowedRolesList = [DATA_COORDINATOR, PARTNER_ADMIN];
    const partner = _.find(partners, (data) => _.intersection(allowedRolesList, data.myRoles).length > 0);
    return user.isSuperuser() || !!partner;
  }

  canManageInstitutionStaff(partnerId?: number) {
    const instanceIdCheck = partnerId ? `instanceId~${partnerId},` : '';
    return this.canView(instanceIdCheck + 'name~adminInstitutionStaff,verb~customVerb!~manage');
  }

  canUpdateCustomRoles(partnerId?: number) {
    const instanceIdCheck = partnerId ? `instanceId~${partnerId},` : '';
    return this.canView(instanceIdCheck + 'name~adminCustomRoles,verb~update');
  }
}

export default AdminPermission;
