import React, { useMemo, useCallback } from 'react';
import { forTemplate } from '@trello/i18n';
import { PopoverList } from 'app/src/components/PopoverList';
import { Button } from '@trello/nachos/button';
import {
  ActionSubjectIdType,
  ActionSubjectType,
  ActionType,
  Analytics,
} from '@trello/atlassian-analytics';

const format = forTemplate('multi_board_table_view');

import styles from './DueFilterPopoverContent.less';

import {
  DueFilter,
  SortingOption,
  RangeFilter,
  CompleteFilter,
  DueFilterValue,
} from 'app/src/components/ViewFilters/filters';
import {
  ViewFiltersSource,
  ViewFiltersSourceEditable,
} from 'app/src/components/ViewFilters';

type PopoverTarget = 'quickFilters' | 'headerCell';

interface DueFilterPopoverContentProps {
  showSortingOptions: boolean;
  showResetButton: boolean;

  popoverTarget: PopoverTarget;
  idOrg: string;

  viewFilters: ViewFiltersSource;
  setDueFilter?: (dueFilter: DueFilter) => void;
  onToggleSorting?: (desc: boolean, multi: boolean) => void;
  onClearSorting?: () => void;
  onClearDueFilter?: () => void;
  // Omittable if showSortingOptions is false.
  isSorted?: boolean;
  isSortedDesc?: boolean;
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
  attributes?: { popoverTarget?: PopoverTarget };

  idOrg: string;
}) => {
  Analytics.sendUIEvent({
    action,
    actionSubject,
    actionSubjectId,
    source: 'filterTableByDueDateInlineDialog',
    attributes,
    containers: {
      organization: {
        id: idOrg,
      },
    },
  });
};

const getFilterItems = ({
  idOrg,
  savedView,
  popoverTarget,
  setDueFilter: setDueFilterOverride,
}: Pick<
  DueFilterPopoverContentProps,
  'idOrg' | 'popoverTarget' | 'setDueFilter'
> & { savedView: ViewFiltersSourceEditable }) => {
  const dueFilter = savedView.filters.due;
  const setDueFilter = setDueFilterOverride ?? savedView.setFilter;
  const setOverdue = (value: boolean) => {
    setDueFilter(dueFilter.setOverdue(value));

    sendAnalyticsUIEvent({
      action: 'toggled',
      actionSubject: 'filter',
      actionSubjectId: 'filterTableOverdue',
      attributes: { popoverTarget },
      idOrg,
    });
  };

  const toggleRangeFilter = (value: RangeFilter) => {
    if (dueFilter.rangeFilter === value) {
      setDueFilter(dueFilter.setRangeFilter(RangeFilter.None));
    } else {
      setDueFilter(dueFilter.setRangeFilter(value));
    }

    switch (value) {
      case RangeFilter.NextDay:
        sendAnalyticsUIEvent({
          action: 'toggled',
          actionSubject: 'filter',
          actionSubjectId: 'filterTableDueNextDay',
          attributes: { popoverTarget },
          idOrg,
        });
        break;
      case RangeFilter.NextWeek:
        sendAnalyticsUIEvent({
          action: 'toggled',
          actionSubject: 'filter',
          actionSubjectId: 'filterTableDueNextWeek',
          attributes: { popoverTarget },
          idOrg,
        });
        break;
      case RangeFilter.NextMonth:
        sendAnalyticsUIEvent({
          action: 'toggled',
          actionSubject: 'filter',
          actionSubjectId: 'filterTableDueNextMonth',
          attributes: { popoverTarget },
          idOrg,
        });
        break;
      case RangeFilter.HasNoDueDate:
        sendAnalyticsUIEvent({
          action: 'toggled',
          actionSubject: 'filter',
          actionSubjectId: 'filterTableNoDueDate',
          attributes: { popoverTarget },
          idOrg,
        });
        break;
      default:
        return;
    }
  };

  const toggleCompleteFilter = (value: CompleteFilter) => {
    if (dueFilter.completeFilter === value) {
      setDueFilter(dueFilter.setCompleteFilter(CompleteFilter.None));
    } else {
      setDueFilter(dueFilter.setCompleteFilter(value));
    }

    sendAnalyticsUIEvent({
      action: 'toggled',
      actionSubject: 'filter',
      actionSubjectId:
        value === CompleteFilter.Complete
          ? 'filterTableDueComplete'
          : 'filterTableDueIncomplete',
      attributes: { popoverTarget },
      idOrg,
    });
  };

  return [
    {
      name: format('filter-by-date'),
      items: [
        {
          name: format('overdue'),
          value: !dueFilter.overdue,
          checked: dueFilter.overdue,
          onClick: setOverdue,
        },
        {
          name: format('due-in-the-next-day'),
          value: RangeFilter.NextDay,
          checked: dueFilter.rangeFilter === RangeFilter.NextDay,
          onClick: toggleRangeFilter,
        },
        {
          name: format('due-in-the-next-week'),
          value: RangeFilter.NextWeek,
          checked: dueFilter.rangeFilter === RangeFilter.NextWeek,
          onClick: toggleRangeFilter,
        },
        {
          name: format('due-in-the-next-month'),
          value: RangeFilter.NextMonth,
          checked: dueFilter.rangeFilter === RangeFilter.NextMonth,
          onClick: toggleRangeFilter,
        },
      ],
    },
    {
      name: format('filter-by-complete'),
      items: [
        {
          name: format('marked-as-complete'),
          value: CompleteFilter.Complete,
          checked: dueFilter.completeFilter === CompleteFilter.Complete,
          onClick: toggleCompleteFilter,
        },
        {
          name: format('marked-as-incomplete'),
          value: CompleteFilter.Incomplete,
          checked: dueFilter.completeFilter === CompleteFilter.Incomplete,
          onClick: toggleCompleteFilter,
        },
      ],
    },
  ];
};

const ClearFilters: React.FunctionComponent<{
  idOrg: string;
  savedView: ViewFiltersSourceEditable;
  onClearDueFilter?: () => void;
}> = ({ idOrg, savedView, onClearDueFilter }) => {
  const clearDueFilters = useCallback(() => {
    savedView.setFilter(new DueFilter());

    sendAnalyticsUIEvent({
      action: 'reset',
      actionSubject: 'filter',
      actionSubjectId: 'resetTableDueFilter',
      idOrg,
    });
    sendAnalyticsUIEvent({
      action: 'removed',
      actionSubject: 'sort',
      actionSubjectId: 'resetTableDueFilter',
      idOrg,
    });
    onClearDueFilter?.();
  }, [savedView, idOrg, onClearDueFilter]);

  return (
    <Button
      className={styles.clearButton}
      appearance="default"
      shouldFitContainer
      onClick={clearDueFilters}
    >
      {format('reset-due-date-filters')}
    </Button>
  );
};

export const DueFilterPopoverContent: React.FC<DueFilterPopoverContentProps> = ({
  showSortingOptions,
  showResetButton,

  popoverTarget,
  idOrg,

  viewFilters,
  setDueFilter,
  onToggleSorting,
  onClearSorting,
  onClearDueFilter,
  isSorted,
  isSortedDesc,
}: DueFilterPopoverContentProps) => {
  const isSortedAsc = isSorted && !isSortedDesc;

  const toggleSorting = useCallback(
    (value: SortingOption) => {
      if (!onClearSorting || !onToggleSorting) {
        return;
      }
      if (value === SortingOption.Ascending) {
        if (isSortedAsc) {
          onClearSorting();
          sendAnalyticsUIEvent({
            action: 'removed',
            actionSubject: 'sort',
            actionSubjectId: 'sortTableDueAscending',
            attributes: { popoverTarget },
            idOrg,
          });
        } else {
          onToggleSorting(false, false);
          sendAnalyticsUIEvent({
            action: 'sorted',
            actionSubject: 'teamTableView',
            actionSubjectId: 'sortTableDueAscending',
            attributes: { popoverTarget },
            idOrg,
          });
        }
      } else if (value === SortingOption.Descending) {
        if (isSortedDesc) {
          onClearSorting();
          sendAnalyticsUIEvent({
            action: 'removed',
            actionSubject: 'sort',
            actionSubjectId: 'sortTableDueDescending',
            attributes: { popoverTarget },
            idOrg,
          });
        } else {
          onToggleSorting(true, false);
          sendAnalyticsUIEvent({
            action: 'sorted',
            actionSubject: 'teamTableView',
            actionSubjectId: 'sortTableDueDescending',
            attributes: { popoverTarget },
            idOrg,
          });
        }
      }
    },
    [
      isSortedAsc,
      onClearSorting,
      onToggleSorting,
      isSortedDesc,
      idOrg,
      popoverTarget,
    ],
  );

  const dueItems = useMemo(() => {
    const items = [
      {
        name: format('sorting'),
        items: [
          {
            name: format('sort-ascending'),
            checked: isSortedAsc,
            value: SortingOption.Ascending,
            onClick: toggleSorting,
          },
          {
            name: format('sort-descending'),
            checked: isSortedDesc,
            value: SortingOption.Descending,
            onClick: toggleSorting,
          },
        ],
      },
      ...(viewFilters.editable
        ? getFilterItems({
            savedView: viewFilters,
            popoverTarget,
            idOrg,
            setDueFilter,
          })
        : []),
    ];

    if (!showSortingOptions) {
      return items.slice(1);
    } else {
      return items;
    }
  }, [
    isSortedAsc,
    toggleSorting,
    isSortedDesc,
    viewFilters,
    popoverTarget,
    idOrg,
    setDueFilter,
    showSortingOptions,
  ]);

  return (
    <>
      <PopoverList<DueFilterValue> items={dueItems} />
      {showResetButton && viewFilters.editable && (
        <ClearFilters
          idOrg={idOrg}
          savedView={viewFilters}
          onClearDueFilter={onClearDueFilter}
        />
      )}
    </>
  );
};
