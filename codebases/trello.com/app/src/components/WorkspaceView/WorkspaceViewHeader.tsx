import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './WorkspaceViewHeader.less';
import { TeamBoardSelector } from 'app/src/components/TeamBoardSelector';
import {
  ViewFiltersContext,
  ViewFiltersSourceEditable,
} from 'app/src/components/ViewFilters';
import { WorkspaceViewName } from 'app/src/components/ViewsGenerics';
import {
  BoardIdAndShortLink,
  BoardsFilter,
} from 'app/src/components/ViewFilters/filters/BoardsFilter';
import { QuickFilterTable } from 'app/src/components/QuickFilterTable';
import { ShareTableView } from 'app/src/components/ShareTableView';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { ProductFeatures } from '@trello/product-features';
import { maxSelectableBoards } from 'app/src/components/TeamBoardSelector/maxSelectableBoards';
import { BoardOption } from 'app/src/components/TeamBoardSelector/TeamBoardSelector';
import { BoardViewContext } from 'app/src/components/BoardViewContext/BoardViewContext';
import { TeamBoardSelectorQuery } from 'app/src/components/TeamBoardSelector/TeamBoardSelectorQuery.generated';
import {
  DueFilter,
  LabelsFilter,
  ListFilter,
  MembersFilter,
} from 'app/src/components/ViewFilters/filters';
import { FilterPopoverButton } from 'app/src/components/FilterPopover';
import { useClearLabelsFiltersWhenRemovingBoards } from './filters/LabelsFilterPopoverContent';
import { useClearListFiltersWhenRemovingBoards } from './filters/ListFilterPopoverContent';
import { useClearMembersFiltersWhenRemovingBoards } from './filters/MembersFilterPopoverContent';
import { useWorkspaceViewHeaderQuery } from './WorkspaceViewHeaderQuery.generated';

type Boards = NonNullable<
  NonNullable<TeamBoardSelectorQuery['member']>['boards']
>;
type BoardOptionValue = Boards[number];

interface WorkspaceViewHeaderHeaderProps {
  title?: string;
  orgId: string;
  idWorkspaceView?: string;
}

const EditableControls: React.FC<{
  orgId: string;
  savedView: ViewFiltersSourceEditable;
}> = ({ orgId, savedView }) => {
  const { boardsData, cardsData } = useContext(BoardViewContext);
  const isBoardsDataBoardsEmpty: boolean = !boardsData.boards?.length;
  const isBoardsOrCardsDataLoading: boolean =
    boardsData.isLoading || cardsData.isLoading || cardsData.isLoadingInitial;

  useEffect(() => {
    if (
      isBoardsDataBoardsEmpty &&
      !isBoardsOrCardsDataLoading &&
      savedView.editable
    ) {
      savedView.setFilter(new ListFilter());
      savedView.setFilter(new LabelsFilter());
      savedView.setFilter(new MembersFilter());
      savedView.setFilter(new DueFilter());
    }
  }, [isBoardsDataBoardsEmpty, isBoardsOrCardsDataLoading, savedView]);

  useClearListFiltersWhenRemovingBoards(boardsData.boards);
  useClearLabelsFiltersWhenRemovingBoards(boardsData.boards);
  useClearMembersFiltersWhenRemovingBoards(boardsData.boards);

  const { data, error, loading } = useWorkspaceViewHeaderQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      orgId,
    },
  });

  const organization = data?.organization;
  const isFreeTeam = Boolean(!organization?.products.length);
  const isStandardTeam = ProductFeatures.isStandardProduct(
    organization?.products[0],
  );

  const disable = (organization && (isFreeTeam || isStandardTeam)) ?? true;

  // Get the first N shortLinks from the URL in order to
  // stay within the batch API limits. Once RMK-997 is solved
  // the slice(0, N) can be removed.
  const shortLinksOrIds = useMemo(
    () =>
      savedView.filters.boards
        .getBoardShortLinksOrIds()
        .slice(0, maxSelectableBoards()) || [],
    [savedView],
  );

  // retain the original order coming from the context to prevent the API from overwriting the board order

  const [selectorBoards, setSelectorBoards] = useState<Boards | undefined>(
    shortLinksOrIds.length === 0 ? [] : undefined,
  );

  // When we receive TeamBoardSelector changes.
  const onSelectedBoardsChange = useCallback(
    (boards: BoardOption[]) => {
      setSelectorBoards(boards.map((board) => board.value));
    },
    [setSelectorBoards],
  );

  // When the boards coming from the view context selected boards change.
  useEffect(() => setSelectorBoards(boardsData.boards), [boardsData.boards]);

  const handleBoardSelectionChange = useCallback(
    (boards: BoardIdAndShortLink[]) => {
      const boardsFilter = new BoardsFilter();
      boardsFilter.setBoards(boards);
      savedView.setFilter(boardsFilter);
    },
    [savedView],
  );

  const selectedBoardData = useMemo((): undefined | BoardOptionValue[] => {
    if (!selectorBoards) {
      return undefined;
    }

    const boards = orgId
      ? selectorBoards.filter(
          (board) => board.idOrganization === orgId && !board.closed,
        )
      : [];
    const boardHash: { [key: string]: BoardOptionValue } = {};
    for (const board of boards) {
      boardHash[board.id] = board;
      boardHash[board.shortLink] = board;
    }

    const sortedBoards = shortLinksOrIds
      .filter((shortLinkOrId) => shortLinkOrId in boardHash)
      .map((shortLinkOrId) => boardHash[shortLinkOrId]);

    return sortedBoards;
  }, [selectorBoards, orgId, shortLinksOrIds]);

  const isProjectBritaEnabled = useFeatureFlag(
    'remarkable.project-brita',
    false,
  );

  if (error) {
    throw error;
  }

  return (
    <>
      {isProjectBritaEnabled ? (
        <>
          <div className={styles.selector} />
          <FilterPopoverButton
            className={styles.filterPopoverButton}
            idOrganization={orgId}
            isDisabled={disable}
            viewFilters={savedView}
          />
        </>
      ) : (
        <>
          <TeamBoardSelector
            className={styles.selector}
            selectedBoards={selectedBoardData ?? []}
            onSelectedBoardsChange={onSelectedBoardsChange}
            setSelectedBoards={handleBoardSelectionChange}
            orgId={orgId}
            isDisabled={disable}
            isBoardOptionsLoading={boardsData.isLoading || loading}
          />
          {savedView.editable && (
            <QuickFilterTable
              idOrganization={orgId}
              onSelectedBoardsChange={onSelectedBoardsChange}
              setSelectedBoards={handleBoardSelectionChange}
              isDisabled={disable}
              viewFilters={savedView}
            />
          )}
        </>
      )}

      <ShareTableView idOrganization={orgId} isDisabled={disable} />
    </>
  );
};

export const WorkspaceViewHeader: React.FC<WorkspaceViewHeaderHeaderProps> = ({
  title,
  orgId,
  idWorkspaceView,
}: WorkspaceViewHeaderHeaderProps) => {
  const { viewFilters } = useContext(ViewFiltersContext);

  return (
    <>
      <div className={styles.filter}>
        {title && (
          <WorkspaceViewName
            initialViewName={title}
            {...(viewFilters.editable && idWorkspaceView
              ? { editable: true, idWorkspaceView }
              : { editable: false })}
          />
        )}
        {viewFilters.editable && (
          <EditableControls orgId={orgId} savedView={viewFilters} />
        )}
      </div>
    </>
  );
};
