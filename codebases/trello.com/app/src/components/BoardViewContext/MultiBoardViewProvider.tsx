import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { ViewFiltersContext } from 'app/src/components/ViewFilters';
import { BoardViewContext, BoardViewContextValue } from './BoardViewContext';
import { maxSelectableBoards } from 'app/src/components/TeamBoardSelector/maxSelectableBoards';
import { NetworkStatus } from '@apollo/client';
import { useMultiBoardViewProviderBoardsQuery } from './MultiBoardViewProviderBoardsQuery.generated';
import { useMultiBoardViewProviderCardsQuery } from './MultiBoardViewProviderCardsQuery.generated';
import { usePermissionsOrganizationQuery } from './PermissionsOrganizationQuery.generated';

import { canEdit } from '@trello/boards';
import { memberId } from '@trello/session-cookie';

const REQUEST_PAGE_SIZE = 250;
const DEFAULT_SORT_ORDER = 'boardOrder,listPos,pos';

interface MultiBoardViewProviderProps {
  idOrg: string;
  children: React.ReactNode;
}

export const MultiBoardViewProvider: React.FC<MultiBoardViewProviderProps> = ({
  idOrg,
  children,
}: MultiBoardViewProviderProps) => {
  const navigateToCard = useCallback((cardUrl: string) => {}, []);

  const getLinkToCardProps: BoardViewContextValue['getLinkToCardProps'] = useCallback(
    ({ cardUrl, onClick }) => {
      return {
        target: cardUrl && '_blank',
        href: cardUrl,
        onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          onClick?.(e);
        },
      };
    },
    [],
  );

  const { viewFilters } = useContext(ViewFiltersContext);

  const shortLinksOrIds = useMemo(
    () =>
      viewFilters.filters.boards
        .getBoardShortLinksOrIds()
        .slice(0, maxSelectableBoards()) || [],
    [viewFilters.filters.boards],
  );

  const {
    data: boardsData,
    loading: boardsLoading,
    error: boardsError,
  } = useMultiBoardViewProviderBoardsQuery({
    variables: {
      orgId: idOrg,
      shortLinksOrIds,
    },
    fetchPolicy: 'cache-first',
    skip: shortLinksOrIds.length === 0,
  });

  // boardsData becomes undefined while loading. We want consumers of the
  // context to access to persistent query data.
  const [persistentBoardData, setPersistentBoardData] = useState(
    boardsData?.organization?.boards,
  );

  useEffect(() => {
    if (
      boardsData?.organization?.boards !== undefined ||
      shortLinksOrIds.length === 0
    ) {
      setPersistentBoardData(boardsData?.organization?.boards);
    }
  }, [boardsData?.organization?.boards, shortLinksOrIds.length]);

  const boardHash: {
    [key: string]: string;
  } = {};

  for (const board of boardsData?.organization?.boards || []) {
    boardHash[board.id] = board.id;
    boardHash[board.shortLink] = board.id;
  }

  const idBoards = shortLinksOrIds
    .filter((shortLinkOrId) => shortLinkOrId in boardHash)
    .map((shortLinkOrId) => boardHash[shortLinkOrId]);

  const idLists = useMemo(() => Array.from(viewFilters.filters.list), [
    viewFilters.filters.list,
  ]);

  const idMembers = useMemo(() => Array.from(viewFilters.filters.members), [
    viewFilters.filters.members,
  ]);

  const { due, dueComplete } = useMemo(
    () => viewFilters.filters.due.toMbapiFormat(),
    [viewFilters.filters.due],
  );

  const labels = useMemo(
    () => viewFilters.filters.labels.getLabelsForServer(),
    [viewFilters.filters.labels],
  );

  const {
    data: cardsData,
    loading: cardsLoading,
    error: cardsError,
    fetchMore: cardsFetchMore,
    networkStatus: cardsNetworkStatus,
  } = useMultiBoardViewProviderCardsQuery({
    variables: {
      idBoards,
      idOrg,
      pageSize: REQUEST_PAGE_SIZE,
      due,
      dueComplete,
      sortBy: viewFilters.filters.sort?.join(',') || DEFAULT_SORT_ORDER,
      idLists,
      labels,
      idMembers,
    },
    skip: idBoards.length === 0,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const error = boardsError || cardsError;

  const isLoadingMoreCards = cardsNetworkStatus === NetworkStatus.fetchMore;
  const isLoadingInitial =
    (cardsLoading &&
      cardsNetworkStatus !== NetworkStatus.setVariables &&
      !isLoadingMoreCards) ||
    boardsLoading;

  const { cursor, total, cards } = cardsData?.organization?.cards || {};

  const canLoadMoreCards = cards && total && cards.length < total;

  const loadMoreCards = useCallback(() => {
    if (!isLoadingMoreCards && cursor) {
      cardsFetchMore({
        variables: {
          cursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          const newQueryResults = fetchMoreResult;

          if (!newQueryResults) {
            return prev;
          }

          const prevCards = prev?.organization?.cards.cards || [];
          const newCards = newQueryResults.organization?.cards.cards || [];

          if (newQueryResults.organization) {
            newQueryResults.organization.cards.cards = [
              ...prevCards,
              ...newCards,
            ];
          }

          return newQueryResults;
        },
      });
    }
  }, [cardsFetchMore, cursor, isLoadingMoreCards]);

  const {
    data: permissionQueryData,
    error: permissionQueryError,
    loading: permissionQueryLoading,
  } = usePermissionsOrganizationQuery({
    variables: {
      orgId: idOrg,
      memberId: memberId || '',
    },
  });

  const canEditBoard = useCallback(
    (idBoard: string) => {
      if (permissionQueryError || permissionQueryLoading) {
        return false;
      }
      if (
        permissionQueryData &&
        permissionQueryData?.member &&
        persistentBoardData?.length
      ) {
        const board = persistentBoardData.find((board) => board.id === idBoard);

        if (board) {
          return canEdit(
            permissionQueryData.member,
            board,
            permissionQueryData?.organization || null,
            permissionQueryData?.organization?.enterprise || null,
          );
        }
      }
      return false;
    },
    [
      permissionQueryData,
      permissionQueryError,
      permissionQueryLoading,
      persistentBoardData,
    ],
  );

  const contextValue = useMemo((): BoardViewContextValue => {
    return {
      contextType: 'workspace',
      boardsData: {
        boards: persistentBoardData,
        isLoading: boardsLoading,
        error: boardsError,
      },
      cardsData: {
        error,
        cards: cards || [],
        isLoading: cardsLoading,
        isLoadingInitial,
        loadMore: loadMoreCards,
        canLoadMore: canLoadMoreCards || false,
        isLoadingMore: isLoadingMoreCards,
      },
      navigateToCard,
      getLinkToCardProps,
      canEditBoard,
      idOrg,
    };
  }, [
    canLoadMoreCards,
    cards,
    cardsLoading,
    error,
    getLinkToCardProps,
    isLoadingInitial,
    isLoadingMoreCards,
    loadMoreCards,
    navigateToCard,
    persistentBoardData,
    boardsLoading,
    boardsError,
    canEditBoard,
    idOrg,
  ]);

  return (
    <BoardViewContext.Provider value={contextValue}>
      {children}
    </BoardViewContext.Provider>
  );
};
