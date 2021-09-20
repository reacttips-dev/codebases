import { useRestrictedGuestsQuery } from './RestrictedGuestsQuery.generated';

interface Args {
  orgId: string;
  boardId: string;
  skip?: boolean;
}

interface Member {
  id: string;
  fullName?: string | null;
}

export const useRestrictedGuests = ({ orgId, boardId, skip }: Args) => {
  const { data, loading } = useRestrictedGuestsQuery({
    variables: {
      orgId,
      boardId,
    },
    skip: !orgId || !boardId || skip,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const hasBoardMemberRestrictions =
    data?.organization?.prefs?.boardInviteRestrict === 'org';

  const teamMemberIds =
    data?.organization?.members?.map((member) => member.id) || [];

  const boardMembersNotInTeam = (data?.board?.members || []).reduce(
    (excludedMembers: Member[], boardMember) => {
      if (!teamMemberIds.includes(boardMember.id)) {
        excludedMembers.push(boardMember);
      }
      return excludedMembers;
    },
    [],
  );

  return {
    hasBoardMemberRestrictions,
    boardMembersNotInTeam,
    loading,
  };
};
