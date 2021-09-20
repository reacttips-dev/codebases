import { useRestrictedBoardVisibilityQuery } from './RestrictedBoardVisibilityQuery.generated';
import { memberId } from '@trello/session-cookie';

interface Args {
  orgId: string;
  boardId: string;
  skip?: boolean;
}

/**
 * Compares the board's visibility with the team's board visibility settings
 */
export const useRestrictedBoardVisibility = ({
  orgId,
  boardId,
  skip,
}: Args) => {
  const { data, loading } = useRestrictedBoardVisibilityQuery({
    variables: {
      orgId,
      boardId,
    },
    skip: !orgId || !boardId || skip,
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const boardVisibility = data?.board?.prefs?.permissionLevel;
  const restrictions = data?.organization?.prefs?.boardVisibilityRestrict;
  const userIsTeamAdmin =
    data?.organization?.memberships?.some(
      (membership) =>
        membership.idMember === memberId && membership.memberType === 'admin',
    ) || false;

  const teamRestrictsCurrentBoardVisibility =
    restrictions &&
    boardVisibility &&
    (restrictions[boardVisibility] === 'none' ||
      (restrictions[boardVisibility] === 'admin' && !userIsTeamAdmin));

  const teamAllowsPrivateBoards =
    restrictions &&
    (restrictions.private === 'org' ||
      (restrictions.private === 'admin' && userIsTeamAdmin));
  const teamAllowsPublicBoards =
    restrictions &&
    (restrictions.public === 'org' ||
      (restrictions.public === 'admin' && userIsTeamAdmin));
  const teamAllowsTeamVisibleBoards =
    restrictions &&
    (restrictions.org === 'org' ||
      (restrictions.org === 'admin' && userIsTeamAdmin));

  const teamRestrictsAllBoardVisibilities =
    !teamAllowsPrivateBoards &&
    !teamAllowsPublicBoards &&
    !teamAllowsTeamVisibleBoards;

  return {
    boardVisibility,
    loading,
    teamAllowsPrivateBoards,
    teamAllowsPublicBoards,
    teamAllowsTeamVisibleBoards,
    teamRestrictsAllBoardVisibilities,
    teamRestrictsCurrentBoardVisibility,
  };
};
