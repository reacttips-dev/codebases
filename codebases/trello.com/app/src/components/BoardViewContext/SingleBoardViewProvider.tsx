import React, { useCallback, useMemo, useContext } from 'react';
import { BoardViewContext, BoardViewContextValue } from './BoardViewContext';
import { useSingleBoardDataQuery } from './SingleBoardDataQuery.generated';
import { memoize } from 'underscore';
import {
  isCustomFieldsEnabled,
  ViewFiltersContext,
} from 'app/src/components/ViewFilters';
import { usePermissionsBoardQuery } from './PermissionsBoardQuery.generated';

import { canEdit } from '@trello/boards';

import { memberId } from '@trello/session-cookie';

/**
 * Providing our own omit helper to ensure type safety.
 *
 * Returns a copy of the object T with the key K omitted.
 */
function omit<T, K extends string>(obj: T, field: K): Omit<T, K> {
  const { [field]: _, ...rest } = obj;
  return rest;
}
interface SingleBoardViewProviderProps {
  idBoard: string;
  navigateToCard?: (id: string) => void;
  closeView?: () => void;
  includeChecklistItems?: boolean;
  children: React.ReactNode;
}

export const SingleBoardViewProvider: React.FC<SingleBoardViewProviderProps> = ({
  idBoard,
  navigateToCard = () => {},
  closeView,
  includeChecklistItems,
  children,
}: SingleBoardViewProviderProps) => {
  const {
    viewFilters: { filters },
  } = useContext(ViewFiltersContext);
  const { data, loading, error } = useSingleBoardDataQuery({
    variables: { idBoard },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const [filteredCards, filteredChecklistItems] = useMemo(() => {
    const isSingleBoardFiltering = filters.isFiltering();
    const idPlugins = data?.board?.boardPlugins;

    const isListClosed = memoize((idList: string) => {
      return data?.board?.lists?.find((list) => list.id === idList)?.closed;
    });

    const visibleCards =
      data?.board?.cards.filter(
        (card) =>
          !card.closed && !card.isTemplate && !isListClosed(card.idList),
      ) || [];

    const filteredCards = isSingleBoardFiltering
      ? visibleCards.filter((card) =>
          filters.checkFilterableCard(
            card,
            data?.board?.customFields || [],
            isCustomFieldsEnabled(idPlugins || []),
          ),
        )
      : visibleCards;

    const filteredChecklistItems = includeChecklistItems
      ? visibleCards.flatMap((card) =>
          card.checklists.flatMap((checklist) =>
            checklist.checkItems
              .filter(
                (item) =>
                  // TODO we may not want to include `item.due`,
                  // it's in here now because Calendar only shows
                  // check items with a due date. Other views (e.g.
                  // TableView) may not have this requirement
                  item.due &&
                  (!isSingleBoardFiltering ||
                    filters.checkAdvancedChecklistItem(item)),
              )
              .map((item) => ({
                item,
                checklist: omit(checklist, 'checkitems'),
                card: omit(card, 'checklists'),
              })),
          ),
        )
      : [];

    return [filteredCards, filteredChecklistItems];
  }, [data?.board, filters, includeChecklistItems]);

  const boardsData: BoardViewContextValue['boardsData'] = useMemo(
    () => ({
      boards: data?.board ? [omit(data?.board, 'cards')] : undefined,
      isLoading: loading,
      error,
    }),
    [data?.board, error, loading],
  );

  const cardsData: BoardViewContextValue['cardsData'] = useMemo(
    () => ({
      cards: filteredCards,
      isLoading: loading,
      isLoadingInitial: loading,
      error,
      loadMore: () => {},
      canLoadMore: false,
      isLoadingMore: false,
      setSortBy: () => {},
    }),
    [loading, error, filteredCards],
  );

  const checklistItemData = useMemo(
    () => ({
      checklistItems: filteredChecklistItems,
    }),
    [filteredChecklistItems],
  );

  const getLinkToCardProps: BoardViewContextValue['getLinkToCardProps'] = useCallback(
    ({ idCard, onClick }) => {
      return {
        href: '#',
        onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          if (idCard) {
            e.preventDefault();
            navigateToCard(idCard);

            onClick?.(e);
          }
        },
      };
    },
    [navigateToCard],
  );

  const {
    data: permissionQueryData,
    error: permissionQueryError,
    loading: permissionQueryLoading,
  } = usePermissionsBoardQuery({
    variables: {
      boardId: idBoard,
      memberId: memberId || '',
    },
  });

  const canEditBoard = useCallback(
    (_: string) => {
      if (permissionQueryError || permissionQueryLoading) {
        return false;
      }
      if (permissionQueryData && permissionQueryData?.member && data?.board) {
        return canEdit(
          permissionQueryData.member,
          data.board,
          permissionQueryData?.board?.organization || null,
          permissionQueryData?.board?.organization?.enterprise || null,
        );
      }
      return false;
    },
    [
      permissionQueryData,
      permissionQueryError,
      permissionQueryLoading,
      data?.board,
    ],
  );

  const contextValue = useMemo(
    (): BoardViewContextValue => ({
      contextType: 'board',
      boardsData,
      cardsData,
      checklistItemData,
      navigateToCard,
      getLinkToCardProps,
      closeView,
      canEditBoard,
      idBoard,
      idOrg: data?.board?.idOrganization || undefined,
    }),
    [
      boardsData,
      cardsData,
      checklistItemData,
      closeView,
      navigateToCard,
      getLinkToCardProps,
      canEditBoard,
      idBoard,
      data?.board?.idOrganization,
    ],
  );

  return (
    <BoardViewContext.Provider value={contextValue}>
      {children}
    </BoardViewContext.Provider>
  );
};
