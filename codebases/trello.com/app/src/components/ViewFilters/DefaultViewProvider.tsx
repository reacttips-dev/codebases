import React, { useMemo } from 'react';
import { maxSelectableBoards } from 'app/src/components/TeamBoardSelector/maxSelectableBoards';
import {
  ViewFiltersContext,
  ViewFiltersContextValue,
  ViewFiltersSourceReadOnly,
} from './ViewFiltersContext';
import { ViewFilters } from './ViewFilters';
import { BoardsFilter } from './filters/BoardsFilter';
import { Spinner } from '@trello/nachos/spinner';
import { useMostRelevantBoards } from './useMostRelevantBoards';

interface DefaultViewProviderProps {
  defaultViewFilters: Partial<ViewFilters>;
  idWorkspace: string;
}

export const DefaultViewProvider: React.FunctionComponent<DefaultViewProviderProps> = ({
  children,
  idWorkspace,
  defaultViewFilters,
}) => {
  const { mostRelevantBoards, loading } = useMostRelevantBoards({
    idOrganization: idWorkspace,
    skip: !!defaultViewFilters.boards,
  });

  const providerValue: ViewFiltersContextValue<ViewFiltersSourceReadOnly> = useMemo(() => {
    const boardsFilter = new BoardsFilter();
    boardsFilter.setBoards(mostRelevantBoards.slice(0, maxSelectableBoards()));

    return {
      viewFilters: {
        filters: new ViewFilters({
          boards: boardsFilter,
          ...defaultViewFilters,
        }),
        editable: false,
      },
    };
  }, [defaultViewFilters, mostRelevantBoards]);

  if (loading) {
    // TODO RMK-1489: BoardTableView should handle BoardsFilter changing
    // after initial mount. For now, wait for loading to finish before
    // mounting BoardTableView.
    return <Spinner centered />;
  }

  return (
    <ViewFiltersContext.Provider value={providerValue}>
      {children}
    </ViewFiltersContext.Provider>
  );
};
