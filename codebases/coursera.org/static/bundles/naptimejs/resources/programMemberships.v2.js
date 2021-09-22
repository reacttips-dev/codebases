import { requireFields } from 'bundles/naptimejs/util/requireFieldsDecorator';
import {
  Member,
  SoftDeletedMember,
  Invited,
  NotMember,
  EmailNotVerified,
  Whitelisted,
} from 'bundles/program-home/constants/ProgramMembershipState';
import NaptimeResource from './NaptimeResource';

class ProgramMemberships extends NaptimeResource {
  static RESOURCE_NAME = 'programMemberships.v2';

  @requireFields('membershipState')
  get isMember() {
    return this.membershipState === Member;
  }

  @requireFields('membershipState')
  get isNotProgramMember() {
    return this.membershipState === NotMember;
  }

  @requireFields('membershipState')
  get isInvited() {
    return this.membershipState === Invited;
  }

  @requireFields('membershipState')
  get isEmailNotVerified() {
    return this.membershipState === EmailNotVerified;
  }

  @requireFields('membershipState')
  get isWhitelisted() {
    return this.membershipState === Whitelisted;
  }

  @requireFields('membershipState')
  get isSoftDeletedMember() {
    return this.membershipState === SoftDeletedMember;
  }

  @requireFields('membershipState')
  get isProgramMember() {
    return this.membershipState === Member;
  }

  @requireFields('membershipState')
  get hasModalToDisplay() {
    return (
      this.isNotProgramMember ||
      this.isEmailNotVerified ||
      this.isInvited ||
      this.isWhitelisted ||
      this.isSoftDeletedMember
    );
  }

  @requireFields('externalUserData')
  get email() {
    return this.externalUserData.definition?.email || '';
  }

  @requireFields('externalUserData')
  get fullName() {
    return this.externalUserData.definition?.fullName || '';
  }
}

export default ProgramMemberships;
