// eslint-disable-next-line no-restricted-imports
import {
  Member_MemberType,
  Board_Membership_MemberType,
  Organization_Membership_MemberType,
} from '@trello/graphql/generated';
import { isMemberAdmin } from '@trello/organizations';

type MemberType =
  | 'admin'
  | 'normal'
  | 'observer'
  | 'virtual'
  | 'deactivated'
  | 'unconfirmed'
  | 'public';

export interface BoardMembership {
  idMember: string;
  memberType: Board_Membership_MemberType;
  deactivated?: boolean;
  unconfirmed?: boolean;
}

interface OrganizationMembership {
  idMember: string;
  memberType: Organization_Membership_MemberType;
  deactivated?: boolean;
  unconfirmed?: boolean;
}

interface Enterprise {
  idAdmins?: string[];
}

interface Organization {
  id: string;
  memberships: OrganizationMembership[];
  enterprise?: Enterprise | null;
}

interface Board {
  memberships: BoardMembership[];
  organization?: Organization | null;
}

interface Member {
  id: string;
  memberType: Member_MemberType;
}

const getMembershipFor = (board: Board, member: Member) => {
  return board.memberships.find(
    (membership) => membership.idMember === member.id,
  );
};

export const getMemberType = (member: Member, board: Board): MemberType => {
  if (member.memberType === 'ghost') {
    return 'virtual';
  }

  // If the member is an admin of the board's org's enterprise, they are implicitly
  // an admin of the baord
  if (board.organization?.enterprise?.idAdmins?.includes(member.id)) {
    return 'admin';
  }

  // If the member is an admin of the board's org, they are implicitly an admin of the baord
  if (board.organization && isMemberAdmin(member, board.organization)) {
    return 'admin';
  }

  const boardMembership = getMembershipFor(board, member);

  if (boardMembership) {
    if (boardMembership.deactivated) {
      return 'deactivated';
    }

    if (boardMembership.unconfirmed) {
      return 'unconfirmed';
    }

    return boardMembership.memberType;
  }

  return 'public';
};
