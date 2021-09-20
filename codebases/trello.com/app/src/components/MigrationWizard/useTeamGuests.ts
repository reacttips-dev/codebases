import { ApolloError } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useBoardsInOrgQuery } from './BoardsInOrgQuery.generated';
import {
  useMembersOfBoardsQuery,
  MembersOfBoardsQuery,
} from './MembersOfBoardsQuery.generated';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';
// eslint-disable-next-line no-restricted-imports
import { Board } from '@trello/graphql/generated';
import { memberId } from '@trello/session-cookie';

interface TeamGuests {
  loading: boolean;
  error?: ApolloError | Error;
  teamGuests: NonNullable<MembersOfBoardsQuery['boards']>[number]['members'];
}

export const useTeamGuests = (orgId: string): TeamGuests => {
  const {
    data: boardsInOrgQueryData,
    loading: boardsInOrgLoading,
    error: boardsInOrgError,
  } = useBoardsInOrgQuery({
    variables: {
      orgId,
    },
    skip: !orgId,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const boards = boardsInOrgQueryData?.organization?.boards || [];
  const idBoards = boards.map((board: Board) => board.id);

  const {
    data: membersOfBoardsQueryData,
    loading: membersOfBoardsLoading,
    error: membersOfBoardsError,
  } = useMembersOfBoardsQuery({
    variables: {
      idBoards,
    },
    skip: boardsInOrgLoading || !orgId,
  });

  useEffect(() => {
    if (boardsInOrgError) {
      sendErrorEvent(boardsInOrgError, {
        tags: {
          ownershipArea: 'trello-bizteam',
          feature: Feature.MigrationWizard,
        },
        extraData: {
          hook: 'useTeamGuests',
        },
      });
    }
  }, [boardsInOrgError]);

  useEffect(() => {
    if (membersOfBoardsError) {
      sendErrorEvent(membersOfBoardsError, {
        tags: {
          ownershipArea: 'trello-bizteam',
          feature: Feature.MigrationWizard,
        },
        extraData: {
          hook: 'useTeamGuests',
        },
      });
    }
  }, [membersOfBoardsError]);

  return useMemo(() => {
    const memberships = boardsInOrgQueryData?.organization?.memberships || [];
    const membersInOrg = memberships.map((membership) => membership.idMember);

    const teamGuests = (membersOfBoardsQueryData?.boards || [])
      .flatMap(({ members }) =>
        members.filter(
          (member) =>
            !membersInOrg.includes(member.id) && member.id !== memberId,
        ),
      )
      .filter(
        ({ id }, i, members) =>
          members.findIndex((member) => member.id === id) === i,
      )
      .sort(
        (memberA, memberB) =>
          memberA?.fullName?.localeCompare(memberB?.fullName ?? '') ?? 0,
      );

    return {
      loading: boardsInOrgLoading || membersOfBoardsLoading,
      error: boardsInOrgError || membersOfBoardsError,
      teamGuests,
    };
  }, [
    boardsInOrgQueryData,
    membersOfBoardsQueryData,
    boardsInOrgLoading,
    membersOfBoardsLoading,
    boardsInOrgError,
    membersOfBoardsError,
  ]);
};
