import { useMemo } from 'react';
import { maxSelectableBoards } from 'app/src/components/TeamBoardSelector/maxSelectableBoards';
import { useMostRelevantOrganizationBoardsQuery } from './MostRelevantOrganizationBoardsQuery.generated';
import {
  useMostRelevantMemberBoardsQuery,
  MostRelevantMemberBoardsQuery,
} from './MostRelevantMemberBoardsQuery.generated';
import { TrelloStorage } from '@trello/storage';
import {
  buildComparator,
  PreferredComparator,
  StandardComparator,
} from 'app/gamma/src/selectors/boards';
import { memberId } from '@trello/session-cookie';
import { useMostRelevantRecentBoardsQuery } from './MostRelevantRecentBoardsQuery.generated';

const _ = require('underscore');

type Board = NonNullable<
  MostRelevantMemberBoardsQuery['organization']
>['boards'][number];

export function useMostRelevantBoards({
  idOrganization,
  skip,
}: {
  idOrganization: string;
  skip: boolean;
}) {
  // In addition to fetching organization boards, this also grabs ids of boards
  // the member belongs to, which we pass to the
  // useMostRelevantMemberBoardsQuery.
  const { data, loading } = useMostRelevantOrganizationBoardsQuery({
    variables: {
      memberId: memberId || '',
      idOrganization,
    },
    skip: skip || !memberId,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const memberBoardIds = data?.member?.boards
    .filter((board) => board.idOrganization === idOrganization)
    .map((board) => board.id);

  // TODO RMK-1497 This can be merged into the above query once we can do
  // queries like member -> boards -> members/labels/lists.
  const {
    data: memberBoardsData,
    loading: memberBoardsLoading,
  } = useMostRelevantMemberBoardsQuery({
    variables: { idOrg: idOrganization, boardIds: memberBoardIds ?? [] },
    skip: memberBoardIds === undefined,
  });

  const idRecentBoards = useMemo(() => {
    if (!memberId) {
      return [];
    }

    const sidebarState: null | {
      idRecentBoards?: string[];
    } = TrelloStorage.get(`sidebarState-${memberId}`);

    // Don't load more than N boards using the batch API (though recently
    // visited boards will likely be cache hits since they're currently
    // loaded by the old stack)
    return sidebarState?.idRecentBoards?.slice(0, maxSelectableBoards()) || [];
  }, []);

  const {
    data: recentBoardsData,
    loading: recentBoardsLoading,
  } = useMostRelevantRecentBoardsQuery({
    variables: { idOrg: idOrganization, idRecentBoards },
    skip: !idRecentBoards || idRecentBoards.length === 0,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const mostRelevantBoards = useMemo(() => {
    if (!loading && !memberBoardsLoading && !recentBoardsLoading) {
      const memberBoards = memberBoardsData?.organization?.boards || [];
      const recentBoards = recentBoardsData?.organization?.boards || [];
      const arbitraryOrgBoards = data?.organization?.boards || [];

      const idBoardsSet = new Set();

      const boards = [
        ...memberBoards,
        ...recentBoards,
        ...arbitraryOrgBoards,
      ].filter((board) => {
        const isDuplicate = idBoardsSet.has(board.id);
        idBoardsSet.add(board.id);

        return (
          !isDuplicate &&
          board.idOrganization === idOrganization &&
          !board.closed
        );
      });

      const boardStars = data?.member?.boardStars;
      const memberIdBoardsSet = new Set(memberBoards.map((board) => board.id));
      const recentIdBoardsSet = new Set(recentBoards.map((board) => board.id));

      if (boards.length > 0) {
        const sortedBoardStars =
          (boardStars && _.sortBy(boardStars, 'pos')) || [];
        const idBoardsStarred =
          (sortedBoardStars &&
            sortedBoardStars.map(
              ({ idBoard }: { idBoard: string }) => idBoard,
            )) ||
          [];

        const preferIsStarred: PreferredComparator<Board> = (board) => {
          return idBoardsStarred.includes(board.id);
        };

        const compareByStarPosition: StandardComparator<Board> = (
          boardA,
          boardB,
        ) => {
          return (
            idBoardsStarred.indexOf(boardA.id) -
            idBoardsStarred.indexOf(boardB.id)
          );
        };

        const preferIsMemberOf: PreferredComparator<Board> = (board) => {
          return memberIdBoardsSet.has(board.id);
        };

        const preferIsRecentlyVisited: PreferredComparator<Board> = (board) => {
          return recentIdBoardsSet.has(board.id);
        };

        const compareByRecentActivity: StandardComparator<Board> = (
          { dateLastActivity: boardATime },
          { dateLastActivity: boardBTime },
        ) => {
          if (!boardATime || !boardBTime) {
            return 0;
          }
          return (
            new Date(boardBTime).getTime() - new Date(boardATime).getTime()
          );
        };

        const comparator = buildComparator<Board>(
          preferIsStarred,
          compareByStarPosition,
          preferIsMemberOf,
          preferIsRecentlyVisited,
          compareByRecentActivity,
        );

        return boards.sort(comparator).slice(0, maxSelectableBoards());
      }
    }
    return [];
  }, [
    loading,
    memberBoardsLoading,
    recentBoardsLoading,
    data,
    recentBoardsData,
    memberBoardsData,
    idOrganization,
  ]);

  return {
    mostRelevantBoards,
    loading: loading || recentBoardsLoading,
  };
}
