// eslint-disable-next-line no-restricted-imports
import {
  Member_MemberType,
  Organization_Membership_MemberType,
} from '@trello/graphql/generated';

/*
 * Minimum set of properties on these model objects
 * required to answer the questions below:
 */

interface Member {
  id: string;
  memberType: Member_MemberType;
  idPremOrgsAdmin?: string[];
}

interface Membership {
  idMember: string;
  memberType: Organization_Membership_MemberType;
  deactivated?: boolean;
  unconfirmed?: boolean;
}

interface Organization {
  id: string;
  idEnterprise?: string | null;
  memberships: Membership[] | null;
}

interface Enterprise {
  id: string;
  idAdmins?: string[];
}

/**
 * Get the type of membership a user has in relation to a given
 * organization. If the org is an Enterprise org, also need to pass
 * in the enterprise
 */
export const getMembershipType = (
  member: Member,
  organization: Organization,
  enterprise?: Enterprise | null,
): 'admin' | 'normal' | 'deactivated' | 'unconfirmed' | 'virtual' | null => {
  const { idPremOrgsAdmin = [] } = member;
  const { memberships = [] } = organization;
  const { id: enterpriseId, idAdmins = [] } = enterprise || ({} as Enterprise);

  /*
   * Is this user even real? If the user is a "ghost" ie. stub user
   * created by an invitation, return "virtual"
   */
  if (member.memberType === 'ghost') {
    return 'virtual';
  }

  /*
   * Is this an Enterprise org? If so, and an Enterprise was passed
   * in, check that the Enterprise is the Enterprise that owns the
   * org and if the user is an admin of the Enterprise. Enterprise
   * admins are automatically admins of all Enterprise orgs, regardless
   * of what the org's membership collection says.
   */
  if (
    organization.idEnterprise &&
    enterpriseId === organization.idEnterprise &&
    idAdmins.includes(member.id)
  ) {
    return 'admin';
  }

  /*
   * Does the provided Member object contain an `idPremOrgsAdmin` array?
   * If so, check to see if it includes this org's id. If so, that's
   * sufficient to say the user is an admin.
   */
  if (idPremOrgsAdmin.includes(organization.id)) {
    return 'admin';
  }

  /*
   * If we've gotten this far, check the memberships collection on the
   * org for a membership with the member's id. It will be either "admin"
   * or "normal", but we also want to check if the member is unconfirmed
   * or deactivated first.
   */
  const membership = memberships?.find((m) => m.idMember === member.id);
  if (membership) {
    if (membership.deactivated) {
      return 'deactivated';
    } else if (membership.unconfirmed) {
      return 'unconfirmed';
    }
    return membership.memberType;
  }

  /*
   * Looks like this user is not a member of this org at all.
   */
  return null;
};

/**
 * Determine if the member is an admin of the given organization. If
 * the org is an enterprise org, also pass in the enterprise in order
 * to check if the member is an enterprise admin
 */
export const isMemberAdmin = (
  member: Member,
  organization: Organization,
  enterprise?: Enterprise | null,
): boolean => getMembershipType(member, organization, enterprise) === 'admin';

/**
 * Determine if the member is a member of the given organization. If
 * the org is an enterprise org, also pass in the enterprise in order
 * to check if the member is an enterprise admin
 */
export const isMember = (
  member: Member,
  organization: Organization,
  enterprise?: Enterprise | null,
): boolean => {
  const memberType = getMembershipType(member, organization, enterprise);
  if (memberType && ['admin', 'normal'].includes(memberType)) {
    return true;
  }
  return false;
};
