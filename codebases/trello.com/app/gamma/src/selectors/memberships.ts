import { State } from 'app/gamma/src/modules/types';
import {
  AccessLevel,
  MemberModel,
  MembershipModel,
} from 'app/gamma/src/types/models';

export const getMemberTypeFromMemberships = (
  state: State,
  memberships: MembershipModel[] = [],
  member: MemberModel,
  idTeam?: string | null | undefined,
): AccessLevel => {
  const membership: MembershipModel | undefined = memberships.find(
    ({ idMember }) => idMember === member.id,
  );
  let memberType: AccessLevel;

  if (
    idTeam &&
    member.idPremOrgsAdmin &&
    member.idPremOrgsAdmin.includes(idTeam)
  ) {
    memberType = AccessLevel.Admin;
  } else if (!membership) {
    memberType = AccessLevel.Public;
  } else if (membership.unconfirmed) {
    memberType = AccessLevel.Unconfirmed;
  } else if (membership.deactivated) {
    memberType = AccessLevel.Deactivated;
  } else {
    memberType = membership.type;
  }

  if (
    memberType !== AccessLevel.Public &&
    member.memberType === AccessLevel.Ghost
  ) {
    memberType = AccessLevel.Virtual;
  }

  return memberType;
};
