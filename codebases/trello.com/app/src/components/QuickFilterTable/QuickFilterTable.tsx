import React, { useCallback, useEffect, useMemo } from 'react';
import styles from './QuickFilterTable.less';
import {
  Popover,
  usePopover,
  PopoverPlacement,
  PopoverScreen,
} from '@trello/nachos/popover';
import { Button } from '@trello/nachos/button';
import { ActionSubjectIdType, Analytics } from '@trello/atlassian-analytics';
import { DownIcon } from '@trello/nachos/icons/down';
import { TacoIcon } from '@trello/nachos/icons/taco';

import { PopoverMenu } from 'app/src/components/PopoverMenu/index';
import { ClockIcon } from '@trello/nachos/icons/clock';
import { CardIcon } from '@trello/nachos/icons/card';
import { MemberIcon } from '@trello/nachos/icons/member';
import { ListIcon } from '@trello/nachos/icons/list';
import { LabelIcon } from '@trello/nachos/icons/label';
import { MembersFilter } from 'app/src/components/ViewFilters/filters';
import { DueFilterPopoverContent } from 'app/src/components/WorkspaceView/filters/DueFilterPopoverContent';
import { MembersFilterPopoverContent } from 'app/src/components/WorkspaceView/filters/MembersFilterPopoverContent';
import { ListFilterPopoverContent } from 'app/src/components/WorkspaceView/filters/ListFilterPopoverContent';
import { LabelsFilterPopoverContent } from 'app/src/components/WorkspaceView/filters/LabelsFilterPopoverContent';
import { useQuickFilterTableSelectedBoardsQuery } from './QuickFilterTableSelectedBoardsQuery.generated';
import { forTemplate } from '@trello/i18n';
import { memberId as myId } from '@trello/session-cookie';

const format = forTemplate('quick_filter_table');

import { QuickFilterMenuItem } from './QuickFilterMenuItem';
import { BoardOption } from 'app/src/components/TeamBoardSelector/TeamBoardSelector';
import { maxSelectableBoards } from 'app/src/components/TeamBoardSelector/maxSelectableBoards';
import { TableTestIds } from '@trello/test-ids';

import {
  useMostRelevantBoards,
  ViewFiltersSourceEditable,
} from 'app/src/components/ViewFilters';
import { BoardIdAndShortLink } from 'app/src/components/ViewFilters/filters/BoardsFilter';
import { LoadingSpinner } from 'app/src/components/LoadingSpinner';
import { useQuickFilterTableMemberQuery } from './QuickFilterTableMemberQuery.generated';

interface QuickFilterTableProps {
  onSelectedBoardsChange: (boardOptions: BoardOption[]) => void;
  setSelectedBoards: (boards: BoardIdAndShortLink[]) => void;
  idOrganization: string;
  isDisabled?: boolean;
  viewFilters: ViewFiltersSourceEditable;
}

export enum Screen {
  QuickFilterScreen,
  QuickFilterDueDate,
  QuickFilterMember,
  QuickFilterList,
  QuickFilterLabel,
}

export const QuickFilterTable: React.FunctionComponent<QuickFilterTableProps> = function QuickFilterTable({
  idOrganization,
  onSelectedBoardsChange,
  setSelectedBoards,
  viewFilters,
  isDisabled,
}) {
  const {
    toggle,
    triggerRef,
    popoverProps,
    push,
  } = usePopover<HTMLButtonElement>();

  const { filters, clearNonBoardFilters, setFilter } = viewFilters;

  const totalFiltersSelected = useMemo((): number => {
    return (
      filters.due.filterLength() +
      filters.members.filterLength() +
      filters.list.filterLength() +
      filters.labels.filterLength()
    );
  }, [filters]);

  const filtersActive = totalFiltersSelected > 0;

  const totalMemberFiltersEnabled = filters.members.filterLength();
  const totalLabelFiltersEnabled = filters.labels.filterLength();
  const totalListFiltersEnabled = filters.list.filterLength();
  const totalDateFiltersEnabled = filters.due.filterLength();

  const noBoards = !filters.boards || filters.boards.filterLength() === 0;

  // Queries the boards in the selector to load metadata for quick filters.
  const {
    data: selectedBoardsData,
    loading: loadingSelectedBoards,
  } = useQuickFilterTableSelectedBoardsQuery({
    variables: {
      idOrg: idOrganization,
      shortLinksOrIds: filters.boards.getBoardShortLinksOrIds(),
    },
    skip: noBoards,
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  const {
    data: memberData,
    loading: loadingMember,
  } = useQuickFilterTableMemberQuery();

  const onClickFilterButton = useCallback(() => {
    if (!popoverProps.isVisible) {
      Analytics.sendClickedButtonEvent({
        buttonName: 'quickFilterTableButton',
        source: 'multiBoardTableViewScreen',
        containers: {
          organization: {
            id: idOrganization,
          },
        },
        attributes: {
          numberBoardsSelected: filters.boards.filterLength(),
          totalMemberFiltersEnabled: filters.members.filterLength(),
          totalLabelFiltersEnabled: filters.labels.filterLength(),
          totalListFiltersEnabled: filters.list.filterLength(),
          totalDateFiltersEnabled: filters.due.filterLength(),
        },
      });
    }
    toggle();
  }, [toggle, idOrganization, popoverProps.isVisible, filters]);

  const sendFilterButtonTrackEvent = useCallback(
    (buttonName: ActionSubjectIdType) => {
      Analytics.sendClickedButtonEvent({
        buttonName: buttonName,
        source: 'multiBoardTableViewScreen',
        containers: {
          organization: {
            id: idOrganization,
          },
        },
        attributes: {
          numberBoardsSelected: filters.boards.filterLength(),
          totalMemberFiltersEnabled: filters.members.filterLength(),
          totalLabelFiltersEnabled: filters.labels.filterLength(),
          totalListFiltersEnabled: filters.list.filterLength(),
          totalDateFiltersEnabled: filters.due.filterLength(),
        },
      });
    },
    [filters, idOrganization],
  );

  useEffect(() => {
    if (popoverProps.isVisible) {
      Analytics.sendScreenEvent({
        name: 'quickFilterTableInlineDialog',
        containers: {
          organization: {
            id: idOrganization,
          },
        },
      });
    }
  }, [popoverProps.isVisible, idOrganization]);

  const {
    mostRelevantBoards,
    loading: loadingMostRelevantBoards,
  } = useMostRelevantBoards({
    idOrganization,
    skip: !noBoards,
  });

  const selectMostRelevantBoards = useCallback(() => {
    if (filters.boards.filterLength() === 0) {
      const boards = mostRelevantBoards.slice(0, maxSelectableBoards());

      onSelectedBoardsChange(
        boards.map((board) => ({
          label: board.name,
          value: board,
        })),
      );

      setSelectedBoards(boards);
    }
  }, [filters, mostRelevantBoards, onSelectedBoardsChange, setSelectedBoards]);

  // Populate the quick filters menus with data from most relevant, otherwise
  // populate with data from selected boards. Default to empty array.
  const quickFiltersBoardsMeta = useMemo(() => {
    if (
      filters.boards.filterLength() === 0 ||
      !selectedBoardsData?.organization?.boards
    ) {
      return mostRelevantBoards;
    } else if (selectedBoardsData?.organization?.boards) {
      return selectedBoardsData?.organization?.boards;
    }
    return [];
  }, [
    mostRelevantBoards,
    selectedBoardsData?.organization?.boards,
    filters.boards,
  ]);

  const onAllCardsClick = useCallback(() => {
    sendFilterButtonTrackEvent('allCardsQuickTableFilter');
    clearNonBoardFilters();
    selectMostRelevantBoards();
  }, [
    sendFilterButtonTrackEvent,
    clearNonBoardFilters,
    selectMostRelevantBoards,
  ]);

  const onClearCardFiltersClick = useCallback(
    function onClearCardFiltersClick() {
      sendFilterButtonTrackEvent('clearCardFiltersButton');
      clearNonBoardFilters();
    },
    [sendFilterButtonTrackEvent, clearNonBoardFilters],
  );

  const onMyCardsClick = useCallback(() => {
    sendFilterButtonTrackEvent('myCardsQuickTableFilter');
    selectMostRelevantBoards();
    const meFilter = new MembersFilter();
    myId && meFilter.enable(myId);
    setFilter(meFilter);
  }, [selectMostRelevantBoards, sendFilterButtonTrackEvent, setFilter]);

  const setDueFilter = useCallback(
    (dueFilter) => {
      selectMostRelevantBoards();
      viewFilters.setFilter(dueFilter);
    },
    [viewFilters, selectMostRelevantBoards],
  );

  const setMembersFilter = useCallback(
    (membersFilter) => {
      selectMostRelevantBoards();
      viewFilters.setFilter(membersFilter);
    },
    [viewFilters, selectMostRelevantBoards],
  );

  const setListFilter = useCallback(
    (listFilter) => {
      selectMostRelevantBoards();
      viewFilters.setFilter(listFilter);
    },
    [viewFilters, selectMostRelevantBoards],
  );

  const setLabelsFilter = useCallback(
    (labelsFilter) => {
      selectMostRelevantBoards();
      viewFilters.setFilter(labelsFilter);
    },
    [viewFilters, selectMostRelevantBoards],
  );

  const formatLabel = function formatLabel(
    string: string,
    totalCount: number,
  ): string {
    return totalCount ? `${string} (${totalCount})` : `${string}`;
  };

  const quickFiltersDataUnavailable = useMemo(() => {
    return (
      isDisabled ||
      loadingMember ||
      ((filters.boards.filterLength() === 0 ||
        !selectedBoardsData?.organization?.boards) &&
        loadingMostRelevantBoards) ||
      (selectedBoardsData?.organization?.boards && loadingSelectedBoards)
    );
  }, [
    isDisabled,
    selectedBoardsData,
    filters,
    loadingMember,
    loadingMostRelevantBoards,
    loadingSelectedBoards,
  ]);

  return (
    <>
      <Button
        className={styles.filterButton}
        onClick={onClickFilterButton}
        ref={triggerRef}
        isDisabled={quickFiltersDataUnavailable}
        data-test-id={TableTestIds.QuickFiltersButton}
      >
        {formatLabel(format('quick-filters'), totalFiltersSelected)}
        <div className={styles.dropDownIcon}>
          <DownIcon
            size="small"
            color={quickFiltersDataUnavailable ? 'disabled' : 'gray'}
          />
        </div>
      </Button>
      <Popover
        {...popoverProps}
        placement={PopoverPlacement.BOTTOM_END}
        title={format('quick-filters')}
        dangerous_disableHideOnUrlSearchParamsChange
        dontOverlapAnchorElement
      >
        {
          //We need to give time for large teams to load board data
          //Or Quick Filters will not be able to populate boards
          quickFiltersDataUnavailable ? (
            <LoadingSpinner />
          ) : (
            <>
              <PopoverScreen id={Screen.QuickFilterScreen}>
                <PopoverMenu>
                  <h4 className={styles.filterBy}>{format('filter-by')}</h4>
                  <QuickFilterMenuItem
                    label={format('all-cards')}
                    onClick={onAllCardsClick}
                    icon={<CardIcon size="small" />}
                    testId={TableTestIds.QuickFilterAllCardsOption}
                  />
                  <QuickFilterMenuItem
                    label={format('your-cards')}
                    onClick={onMyCardsClick}
                    icon={<TacoIcon size="small"></TacoIcon>}
                  />
                  <QuickFilterMenuItem
                    label={formatLabel(
                      format('due-date'),
                      totalDateFiltersEnabled,
                    )}
                    icon={<ClockIcon size="small" />}
                    pushScreen={push}
                    screen={Screen.QuickFilterDueDate}
                    showArrow={true}
                  />
                  <QuickFilterMenuItem
                    label={formatLabel(
                      format('member'),
                      totalMemberFiltersEnabled,
                    )}
                    icon={<MemberIcon size="small" />}
                    pushScreen={push}
                    screen={Screen.QuickFilterMember}
                    showArrow={true}
                  />
                  <QuickFilterMenuItem
                    label={formatLabel(format('list'), totalListFiltersEnabled)}
                    icon={<ListIcon size="small" />}
                    pushScreen={push}
                    screen={Screen.QuickFilterList}
                    showArrow={true}
                  />
                  <QuickFilterMenuItem
                    label={formatLabel(
                      format('label'),
                      totalLabelFiltersEnabled,
                    )}
                    icon={<LabelIcon size="small" />}
                    pushScreen={push}
                    screen={Screen.QuickFilterLabel}
                    showArrow={true}
                  />
                </PopoverMenu>

                <Button
                  className={'clearCardFilters'}
                  onClick={onClearCardFiltersClick}
                  isDisabled={!filtersActive}
                  shouldFitContainer={true}
                >
                  {format('clear-card-filters')}
                </Button>

                <div className={styles.relevantLabel}>
                  {format('displays-up-to-x', {
                    numberOfBoards: maxSelectableBoards(),
                  })}
                </div>
              </PopoverScreen>
              <PopoverScreen
                id={Screen.QuickFilterDueDate}
                title={format('due-date')}
              >
                <DueFilterPopoverContent
                  idOrg={idOrganization}
                  popoverTarget="quickFilters"
                  showResetButton={false}
                  showSortingOptions={false}
                  viewFilters={viewFilters}
                  setDueFilter={setDueFilter}
                ></DueFilterPopoverContent>
              </PopoverScreen>
              <PopoverScreen
                id={Screen.QuickFilterMember}
                title={format('member')}
              >
                <MembersFilterPopoverContent
                  idOrg={idOrganization}
                  popoverTarget="quickFilters"
                  showResetButton={false}
                  membersFilter={filters.members}
                  setMembersFilter={setMembersFilter}
                  loading={false}
                  error={false}
                  boards={quickFiltersBoardsMeta}
                ></MembersFilterPopoverContent>
              </PopoverScreen>
              <PopoverScreen id={Screen.QuickFilterList} title={format('list')}>
                <ListFilterPopoverContent
                  idOrg={idOrganization}
                  popoverTarget="quickFilters"
                  showResetButton={false}
                  listFilter={filters.list}
                  setListFilter={setListFilter}
                  boards={quickFiltersBoardsMeta}
                ></ListFilterPopoverContent>
              </PopoverScreen>
              <PopoverScreen
                id={Screen.QuickFilterLabel}
                title={format('label')}
              >
                <LabelsFilterPopoverContent
                  idOrg={idOrganization}
                  popoverTarget="quickFilters"
                  showResetButton={false}
                  labelsFilter={filters.labels}
                  setLabelsFilter={setLabelsFilter}
                  boards={quickFiltersBoardsMeta}
                  member={
                    memberData?.member || { prefs: { colorBlind: false } }
                  }
                ></LabelsFilterPopoverContent>
              </PopoverScreen>
            </>
          )
        }
      </Popover>
    </>
  );
};
