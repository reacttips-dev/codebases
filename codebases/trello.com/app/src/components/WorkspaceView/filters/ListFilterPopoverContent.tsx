import React, { useEffect, useMemo, useCallback, useContext } from 'react';
import { Button } from '@trello/nachos/button';
import { PopoverList } from 'app/src/components/PopoverList';
import { ListFilter } from 'app/src/components/ViewFilters/filters';
import {
  ActionSubjectIdType,
  ActionSubjectType,
  ActionType,
  Analytics,
} from '@trello/atlassian-analytics';
import { forTemplate } from '@trello/i18n';
import { ViewFiltersContext } from 'app/src/components/ViewFilters';

const format = forTemplate('multi_board_table_view');

import styles from './ListFilterPopoverContent.less';

type PopoverTarget = 'quickFilters' | 'headerCell';

interface ListFilterPopoverContentProps {
  showResetButton: boolean;

  popoverTarget: PopoverTarget;
  idOrg: string;

  listFilter: ListFilter;
  setListFilter: (listsFilter: ListFilter) => void;
  boards: Board[];
  onClearListFilter?: () => void;
  onToggleFilterValue?: (idList: string, numEnabled: number) => void;
}

const sendAnalyticsUIEvent = ({
  action,
  actionSubject,
  actionSubjectId,
  attributes,
  idOrg,
}: {
  action: ActionType;
  actionSubject: ActionSubjectType;
  actionSubjectId: ActionSubjectIdType;
  attributes?: {
    totalListFiltersEnabled?: number;
    popoverTarget?: PopoverTarget;
  };

  idOrg: string;
}) => {
  Analytics.sendUIEvent({
    action,
    actionSubject,
    actionSubjectId,
    source: 'filterTableByListInlineDialog',
    attributes,
    containers: {
      organization: {
        id: idOrg,
      },
    },
  });
};

interface List {
  id: string;
  name: string;
}

interface Board {
  lists: List[];
  name: string;
}

export const ListFilterPopoverContent = ({
  showResetButton,

  popoverTarget,
  idOrg,

  listFilter,
  setListFilter,
  boards,
  onClearListFilter,
  onToggleFilterValue,
}: ListFilterPopoverContentProps) => {
  const toggleFilterValue = useCallback(
    (idList) => {
      setListFilter(listFilter.toggle(idList));

      onToggleFilterValue && onToggleFilterValue(idList, listFilter.size);
      sendAnalyticsUIEvent({
        action: 'toggled',
        actionSubject: 'filter',
        actionSubjectId: 'filterTableByList',
        attributes: {
          popoverTarget,
          totalListFiltersEnabled: listFilter.size,
        },
        idOrg,
      });
    },
    [setListFilter, listFilter, onToggleFilterValue, popoverTarget, idOrg],
  );

  const isChecked = useCallback((idList) => listFilter.isEnabled(idList), [
    listFilter,
  ]);

  const clearListFilter = useCallback(() => {
    setListFilter(new ListFilter());

    onClearListFilter && onClearListFilter();
    sendAnalyticsUIEvent({
      action: 'reset',
      actionSubject: 'filter',
      actionSubjectId: 'resetTableListFilter',
      attributes: {
        popoverTarget,
      },
      idOrg,
    });
  }, [setListFilter, onClearListFilter, popoverTarget, idOrg]);

  const items = useMemo(() => {
    return boards.map((board) => ({
      name: board.name,
      items: board.lists.map(({ id, name }) => ({
        value: id,
        name,
        checked: isChecked,
        onClick: toggleFilterValue,
      })),
    }));
  }, [boards, isChecked, toggleFilterValue]);

  return (
    <>
      <PopoverList
        items={items}
        searchable
        searchPlaceholder={format('search-lists')}
      />
      {showResetButton && (
        <Button
          className={styles.clearButton}
          appearance="default"
          shouldFitContainer
          onClick={clearListFilter}
        >
          {format('reset-list-filters')}
        </Button>
      )}
    </>
  );
};

export const useClearListFiltersWhenRemovingBoards = (boards?: Board[]) => {
  const { viewFilters } = useContext(ViewFiltersContext);

  // Remove selected lists from filter if their boards were removed.
  useEffect(() => {
    if (!boards || !viewFilters.editable) {
      return;
    }

    const validIdLists = new Set();
    for (const board of boards) {
      for (const list of board.lists) {
        validIdLists.add(list.id);
      }
    }

    const missingIdLists = [...viewFilters.filters.list].filter(
      (idList) => !validIdLists.has(idList),
    );

    if (missingIdLists.length) {
      for (const missingIdList of missingIdLists) {
        viewFilters.filters.list.disable(missingIdList);
      }

      viewFilters.setFilter(new ListFilter(viewFilters.filters.list));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boards]); // We only want this to fire when the selected boards have changed.
};
