import { observer } from 'mobx-react-lite';
import {
    sort,
    sortBySortColumn,
    sortOrder,
    ascending,
    descending,
    oldestOnTop,
    newestOnTop,
    largestOnTop,
    smallestOnTop,
    highOnTop,
    lowOnTop,
} from './MailFilterContextMenu.locstring.json';
import { spotlightFilter } from '../strings.locstring.json';
import loc from 'owa-localize';
import getSortColumnDisplay from '../helpers/getSortColumnDisplay';
import getViewFilterDisplay from '../helpers/getViewFilterDisplay';
import { lazySelectFilter, lazySelectSort, lazyLoadSpotlightFilter } from 'owa-mail-filter-actions';
import {
    getSortByForTable,
    listViewStore,
    MailSortHelper,
    SortColumn,
    TableQueryType,
} from 'owa-mail-list-store';
import type { ActionSource } from 'owa-mail-store';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import * as React from 'react';
import {
    ContextualMenu,
    DirectionalHint,
    IContextualMenuItem,
    ContextualMenuItemType,
} from '@fluentui/react/lib/ContextualMenu';
import { lazyGetPauseInboxContextMenuItem } from 'owa-mail-pause-inbox';
import { IsShadowMailboxUser } from 'owa-mail-ads-shared/lib/sharedAdsUtils';
import { isSpotlightEnabled } from 'owa-mail-spotlight';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { isFeatureEnabled } from 'owa-feature-flags';

export interface MailListFilterContextMenuProps {
    currentViewFilter: ViewFilter;
    supportedViewFilters: ViewFilter[];
    contextMenuTargetElement: HTMLElement;
    dismissContextMenu: (ev?: any) => void;
    tableViewId: string;
    filterMenuSource?: ActionSource;
}

import styles from './MailListFilterMenu.scss';

export default observer(function MailFilterContextMenu(props: MailListFilterContextMenuProps) {
    const tableView = React.useMemo(() => {
        return listViewStore.tableViews.get(props.tableViewId);
    }, [props.tableViewId]);

    // Create listview Filters menu
    const createMenuItems = (): IContextualMenuItem[] => {
        const filterMenu: IContextualMenuItem[] = props.supportedViewFilters
            .filter(
                viewFilter =>
                    !(
                        IsShadowMailboxUser() &&
                        (viewFilter === 'Mentioned' || viewFilter === 'ToOrCcMe')
                    )
            )
            .map((viewFilter: ViewFilter) => {
                return getViewFilterMenuItems(viewFilter);
            });

        if (
            isSpotlightEnabled() &&
            tableView.tableQuery.folderId &&
            folderIdToName(tableView.tableQuery.folderId) == 'inbox'
        ) {
            filterMenu.push({
                key: 'importantFilter',
                name: loc(spotlightFilter),
                canCheck: true,
                data: 'Important',
                onClick: onFilterSelected,
            });
        }

        if (tableView.tableQuery.type != TableQueryType.Search) {
            // For conversation lists sort options will be disabled for Monarch unless the sort flight is on
            const isSortDisabled =
                tableView.tableQuery.listViewType == ReactListViewType.Conversation &&
                isHostAppFeatureEnabled('nativeResolvers') &&
                isFeatureEnabled('mon-conv-useHx') &&
                !isFeatureEnabled('mon-conv-useHxForConvListViewSort');

            filterMenu.push({
                key: 'divider',
                name: '-',
                itemType: ContextualMenuItemType.Divider,
            });
            const folderId = listViewStore.tableViews.get(props.tableViewId).tableQuery.folderId;
            filterMenu.push({
                key: 'sortBy',
                disabled: isSortDisabled,
                itemProps: {
                    styles: {
                        root: isSortDisabled && styles.disabledSort, // The Fluent control's disabled color, doesn't look disabled in dark mode so we have to hard code and override it.
                    },
                },
                submenuIconProps: {
                    styles: {
                        root: isSortDisabled && styles.disabledSort,
                    },
                },
                name: loc(sort),
                items: getSortMenuItems(),
            });
            const getPauseInboxContextMenuItem = lazyGetPauseInboxContextMenuItem.tryImportForRender();
            if (getPauseInboxContextMenuItem) {
                const pauseMenuItem = getPauseInboxContextMenuItem(
                    folderId,
                    props.dismissContextMenu,
                    'filterMenu'
                );
                if (pauseMenuItem) {
                    filterMenu.push({
                        key: 'divider',
                        name: '-',
                        itemType: ContextualMenuItemType.Divider,
                    });
                    filterMenu.push(pauseMenuItem);
                }
            }
        }
        return filterMenu;
    };
    const getSortMenuItems = (): IContextualMenuItem[] => {
        const currentSortBy = getSortByForTable(tableView);
        const isAscending = currentSortBy.sortDirection == MailSortHelper.ASCENDING_SORT_DIR;
        const currentSortColumn = currentSortBy.sortColumn;
        const supportedSortColumns = MailSortHelper.getSupportedSortColumns(
            tableView.tableQuery.folderId
        );
        const sortMenuItems: IContextualMenuItem[] = [];
        const sortByMenuItems: IContextualMenuItem[] = [];
        supportedSortColumns.forEach(sortColumn => {
            const isSelected = currentSortColumn == sortColumn;
            sortByMenuItems.push({
                key: sortColumn.toString(),
                name: getSortColumnDisplay(sortColumn),
                data: {
                    sortOrder: isSelected
                        ? currentSortBy.sortDirection
                        : MailSortHelper.getDefaultSortDirectionForSortColumn(sortColumn),
                    sortColumn: sortColumn,
                },
                onClick: onSortSelected,
                canCheck: true,
                isChecked: isSelected,
            });
        });
        sortMenuItems.push({
            key: 'sortBySection',
            itemType: ContextualMenuItemType.Section,
            sectionProps: {
                bottomDivider: true,
                title: loc(sortBySortColumn),
                items: sortByMenuItems,
            },
        });
        const { ascendingString, descendingString } = getSortDirectionStrings(currentSortColumn);
        const sortOrderMenuItems: IContextualMenuItem[] = [
            {
                key: 'ascending',
                name: ascendingString,
                data: { sortOrder: 'Ascending', sortColumn: currentSortColumn },
                onClick: onSortSelected,
                canCheck: true,
                isChecked: isAscending,
            },
            {
                key: 'descending',
                name: descendingString,
                data: { sortOrder: 'Descending', sortColumn: currentSortColumn },
                onClick: onSortSelected,
                canCheck: true,
                isChecked: !isAscending,
            },
        ];
        sortMenuItems.push({
            key: 'sortOrderSection',
            itemType: ContextualMenuItemType.Section,
            sectionProps: {
                bottomDivider: true,
                title: loc(sortOrder),
                items: sortOrderMenuItems,
            },
        });
        return sortMenuItems;
    };
    // Gets View Filters menu items
    const getViewFilterMenuItems = (viewFilter: ViewFilter): IContextualMenuItem => {
        return {
            key: viewFilter.toString(),
            name: getViewFilterDisplay(viewFilter),
            data: viewFilter,
            canCheck: true,
            isChecked: props.currentViewFilter == viewFilter,
            onClick: onFilterSelected,
        };
    };
    const onSortSelected = (
        ev?: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>,
        item?: IContextualMenuItem
    ) => {
        props.dismissContextMenu();
        lazySelectSort.importAndExecute(
            item.data.sortColumn,
            item.data.sortOrder,
            props.tableViewId,
            props.filterMenuSource
        );
    };
    // Callback when filter menu item is selected
    const onFilterSelected = (
        ev?: React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>,
        item?: IContextualMenuItem
    ) => {
        props.dismissContextMenu();
        const selectedFilter = item.data as string;

        if (selectedFilter === 'Important') {
            lazyLoadSpotlightFilter.importAndExecute(props.filterMenuSource);
        } else {
            lazySelectFilter.importAndExecute(selectedFilter as ViewFilter, props.filterMenuSource);
        }
    };
    const { dismissContextMenu, contextMenuTargetElement } = props;
    const items: IContextualMenuItem[] = createMenuItems();
    return (
        <ContextualMenu
            shouldFocusOnMount={true}
            target={contextMenuTargetElement}
            directionalHint={DirectionalHint.bottomRightEdge}
            onDismiss={dismissContextMenu}
            items={items}
        />
    );
});

function getSortDirectionStrings(sortColumn: SortColumn) {
    switch (sortColumn) {
        case SortColumn.Date:
            return { ascendingString: loc(oldestOnTop), descendingString: loc(newestOnTop) };
        case SortColumn.From:
        case SortColumn.Subject:
            return { ascendingString: loc(ascending), descendingString: loc(descending) };
        case SortColumn.Size:
            return { ascendingString: loc(smallestOnTop), descendingString: loc(largestOnTop) };
        case SortColumn.Importance:
            return { ascendingString: loc(lowOnTop), descendingString: loc(highOnTop) };
        default:
            throw new Error('Sort not implemented');
    }
}
