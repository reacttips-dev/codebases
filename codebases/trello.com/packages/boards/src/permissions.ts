import { getMemberType } from './memberships';
import {
  isMember as isOrgMember,
  isMemberAdmin as isOrgMemberAdmin,
} from '@trello/organizations';

export const canEdit = (
  member: Parameters<typeof getMemberType>[0],
  board: Parameters<typeof getMemberType>[1] & {
    prefs?: {
      selfJoin?: boolean;
      isTemplate?: boolean;
    } | null;
  },
  organization: Parameters<typeof isOrgMember>[1] | null,
  enterprise: Parameters<typeof isOrgMember>[2] | null,
) => {
  const memberType = getMemberType(member, board);

  const orgAdmin =
    organization && isOrgMemberAdmin(member, organization, enterprise);

  if ('observer' === memberType && !orgAdmin) {
    return false;
  }

  // existing board member or the org/ent admin can edit
  if (['admin', 'normal'].includes(memberType) || orgAdmin) {
    return true;
  }

  // non board members
  if (board.prefs?.selfJoin && organization && !board.prefs?.isTemplate) {
    if (isOrgMember(member, organization, enterprise)) {
      return true;
    }
  }
  return false;
};
