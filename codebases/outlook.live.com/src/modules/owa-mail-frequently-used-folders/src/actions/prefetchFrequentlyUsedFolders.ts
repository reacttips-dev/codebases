import folderPrefetchedAction from './folderPrefetchedAction';
import initializeFrequentlyUsedFolders from './initializeFrequentlyUsedFolders';
import { getStore } from '../store/store';
import { logUsage } from 'owa-analytics';
import {
    isFolderPersonaFavoriteSearchFolder,
    isFolderPrivateDLFavoriteSearchFolder,
} from 'owa-favorites';
import createMailFolderTableQuery from 'owa-mail-triage-table-utils/lib/createMailFolderTableQuery';
import loadInitialRowsFromServer from 'owa-mail-list-actions/lib/actions/table/loadInitialRowsFromServer';
import {
    TableView,
    MailFolderScenarioType,
    listViewStore,
    MailRowDataPropertyGetter,
    TableQueryType,
    MailFolderTableQuery,
    getSelectedTableView,
} from 'owa-mail-list-store';
import { getListViewTypeForFolder } from 'owa-mail-folder-store';
import { getTableViewFromTableQuery } from 'owa-mail-triage-table-utils';
import onInitialTableLoadComplete from 'owa-mail-table-loading-actions/lib/actions/onInitialTableLoadComplete';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import prefetch from 'owa-service/lib/prefetch';
import { action } from 'satcheljs/lib/legacy';
import { updateTablesInCache } from 'owa-mail-triage-local-updates/lib/actions/tableCache/updateTablesInCache';
import { canAddToList } from 'owa-mail-triage-local-updates/lib/actions/tableCache/mruTableIdList';
import getSortByFolderId from 'owa-mail-folder-store/lib/selectors/getSortByFolderId';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { shouldTableSortByRenewTime } from 'owa-mail-list-response-processor';
import {
    FilteredFolderFilterProperties,
    FILTER_FOLDER_ID_BUILDER,
} from '../types/FilteredFolderFilterProperties';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';
import { getTableQueryForFilteredFolder } from '../utils/getTableQueryForFilteredFolder';
import { isFeatureEnabled } from 'owa-feature-flags';

// prefetch frequently used folders and add them to mru cache
export default action('prefetchFrequentlyUsedFolders')(function prefetchFrequentlyUsedFolders() {
    if (isFeatureEnabled('fwk-prefetch-data-off')) {
        return;
    }

    const FOLDER_PREFETCH_DELAY_MS: number = 10000;
    initializeFrequentlyUsedFolders();
    setTimeout(prefetchFoldersInternal, FOLDER_PREFETCH_DELAY_MS);
});

function prefetchFoldersInternal() {
    const MAX_FOLDERS_TO_PREFETCH: number = 5;
    const store = getStore();
    const folderCount = Math.min(MAX_FOLDERS_TO_PREFETCH, store.frequentlyUsedFolders.length);
    let prefetchFolderPromises = [];

    prefetch(() => {
        for (let i = 0; i < folderCount; i++) {
            const folderId = store.frequentlyUsedFolders[i].FolderId;
            let tableQuery = null;

            if (isFilteredFolder(folderId)) {
                const filteredFolderProps = getFilterTypeAndValueForFilteredFolder(folderId);
                if (
                    !(
                        filteredFolderProps &&
                        shouldPrefetchFilteredFolder(filteredFolderProps.filterType)
                    )
                ) {
                    continue;
                }

                tableQuery = getTableQueryForFilteredFolder(filteredFolderProps);
            } else {
                // VSO 30372: update FUF list when a folder/category is deleted
                tableQuery = createMailFolderTableQuery(
                    folderId,
                    getListViewTypeForFolder(folderId),
                    getScenarioTypeForFolderId(folderId),
                    FocusedViewFilter.None,
                    null /* viewFilter */,
                    null /* categoryName */,
                    getSortByFolderId(folderId)
                );
            }

            // TableQuery can be null when trying to prefetch a deleted filteredFolder
            if (!tableQuery) {
                continue;
            }

            const tableView: TableView = getTableViewFromTableQuery(tableQuery);
            const selectedTableView: TableView = getSelectedTableView();

            // Prefetch folder only if it is not already selected and
            // if MRU table list has not reached max capacity
            if (selectedTableView && selectedTableView.id != tableView.id && canAddToList()) {
                // Update table cache list
                if (
                    updateTablesInCache(
                        tableView,
                        false /* add to end of the list since this is the FUF order */
                    ) == -1
                ) {
                    const promise = loadInitialRowsFromServer(
                        tableView,
                        true /* isTablePrefetched */,
                        onInitialTableLoadComplete
                    );

                    prefetchFolderPromises.push(promise);
                    folderPrefetchedAction(folderId);
                }
            }
        }

        logFrequentlyUsedFoldersCount(folderCount);

        // Log number of pinned rows after we are done prefetching all FUF folders
        Promise.all(prefetchFolderPromises)
            .then(() => {
                logPinnedRowsCountForMailTablesInCache();
            })
            .catch(error => {
                // catch error so we don't bubble this up, which would result in alerting errors.
                return;
            });
    });
}

function logFrequentlyUsedFoldersCount(maxFolderCountToPrefetch: number) {
    const store = getStore();

    logUsage('prefetchFrequentlyUsedFolders_count', {
        total: maxFolderCountToPrefetch,
        personaTotal: store.frequentlyUsedFolders
            .slice(0, maxFolderCountToPrefetch)
            .filter(folder => isFolderPersonaFavoriteSearchFolder(folder.FolderId)).length,
        allPrefetched: store.prefetchedFolderIds.size,
        personaPrefetched: [...store.prefetchedFolderIds.keys()].filter(folderId =>
            isFolderPersonaFavoriteSearchFolder(folderId)
        ).length,
    });
}

/**
 * Logs total number of pinned rows in the folders that are in the cache after prefetching the FUF.
 * Also logs number of pinned rows in the Inbox folder
 */
function logPinnedRowsCountForMailTablesInCache() {
    let totalPinnedRows: number = 0;
    let pinnedRowsInInbox: number = 0;
    let folderWith20OrMorePinnedRows: number = 0;
    let folderWith10OrMorePinnedRows: number = 0;
    let numberOfTablesThatSupportPinning: number = 0;
    let numberOfTablesVisited: number = 0;

    const inboxFolderId = folderNameToId('inbox');
    const tableViews = listViewStore.tableViews.values();

    for (let tableView of tableViews) {
        // We are only interested in Folder types
        const tableQuery = tableView.tableQuery;
        const folderId = tableQuery.folderId;
        if (tableQuery.type != TableQueryType.Folder) {
            return;
        }

        numberOfTablesVisited++;
        if (shouldTableSortByRenewTime(tableQuery)) {
            numberOfTablesThatSupportPinning++;
        }

        let pinnedRowsInFolder: number = 0;
        for (let i = 0; i < tableView.rowKeys.length; i++) {
            const rowKey = tableView.rowKeys[i];
            const isRowPinned = MailRowDataPropertyGetter.getIsPinned(rowKey, tableView);

            if (isRowPinned) {
                pinnedRowsInFolder++;
            } else {
                // We break as soon as we get first unpinned row
                break;
            }
        }

        if (
            folderId === inboxFolderId &&
            (tableQuery as MailFolderTableQuery).viewFilter === 'All'
        ) {
            pinnedRowsInInbox += pinnedRowsInFolder;
        }

        totalPinnedRows += pinnedRowsInFolder;

        if (pinnedRowsInFolder >= 20) {
            folderWith20OrMorePinnedRows++;
        } else if (pinnedRowsInFolder >= 10) {
            folderWith10OrMorePinnedRows++;
        }
    }

    logUsage('TnS_PinnedRowsCount', {
        total: totalPinnedRows,
        inbox: pinnedRowsInInbox,
        tfc: numberOfTablesVisited /* total tables visited */,
        pfc: numberOfTablesThatSupportPinning /* tables visited that support pinning */,
        ftwenty: folderWith20OrMorePinnedRows,
        ften: folderWith10OrMorePinnedRows,
    });
}

function getScenarioTypeForFolderId(folderId: string): MailFolderScenarioType {
    if (isFolderPersonaFavoriteSearchFolder(folderId)) {
        return 'persona';
    } else if (isFolderPrivateDLFavoriteSearchFolder(folderId)) {
        return 'privatedistributionlist';
    } else {
        return 'mail';
    }
}

/**
 * Gets the filter folder type and value given the folderId
 * @param folderId folderId from which to derive the the filteredFolderFilterProperties
 */
function getFilterTypeAndValueForFilteredFolder(folderId: string): FilteredFolderFilterProperties {
    const filteredFolderProperties = folderId.split(FILTER_FOLDER_ID_BUILDER);

    if (filteredFolderProperties.length == 2) {
        return {
            filterType: filteredFolderProperties[0] as ViewFilter,
            filterValue: filteredFolderProperties[1],
        };
    }

    return null;
}

/**
 * Gets a flag indicating whether to prefetch the filtered folder
 * @param filterType the filter type for the filtered folder
 */
function shouldPrefetchFilteredFolder(filterType: string): boolean {
    return filterType == 'UserCategory';
}

/**
 * Gets the flag indicating whether the folderId is for a filtered folder
 * @param fufFolderId the folder id from frequently used folders list
 */
function isFilteredFolder(fufFolderId: string): boolean {
    const folderFilterTypes = ['SystemCategory', 'Hashtag', 'UserCategory'];
    return folderFilterTypes.reduce(
        (isMatch, folderToMatch) =>
            isMatch || fufFolderId.slice(0, folderToMatch.length) == folderToMatch,
        false
    );
}
