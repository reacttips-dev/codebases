import loadInitialRowsFromServer from './loadInitialRowsFromServer';
import { PerformanceDatapoint, returnTopExecutingActionDatapoint } from 'owa-analytics';
import { initTableSelectionOnLoad } from 'owa-mail-actions/lib/initTableSelectionOnLoad';
import { lazyLoadImportantTable } from 'owa-mail-spotlight';
import type { OnInitialTableLoadComplete } from 'owa-mail-loading-action-types';
import type { ActionSource } from 'owa-mail-store';
import { updateTablesInCache } from 'owa-mail-triage-local-updates/lib/actions/tableCache/updateTablesInCache';
import { MAX_CACHED_ROWS_TO_SHOW_TABLE_LOAD } from 'owa-mail-triage-table-utils';
import {
    MailFolderTableQuery,
    TableQueryType,
    TableView,
    isFolderPaused,
} from 'owa-mail-list-store';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { mutatorAction } from 'satcheljs';

/**
 * Performs the first load for a mail table
 * @param tableView - the given mail tableView
 * @param onInitialTableLoadComplete - callback for when the initial table load has completed
 * @param actionSource action that initiated the switch folder action
 * @return a promise that resolves when the load initial table has completed either from server or from cache
 */
export default function loadInitialMailTable(
    tableView: TableView,
    onInitialTableLoadComplete: OnInitialTableLoadComplete,
    actionSource: ActionSource,
    initialSessionData?: SessionData,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
): Promise<void> {
    setCurrentLoadedIndex(tableView);

    // Init table selection on any cached items we have
    initTableSelectionOnLoad(tableView);

    const isTableViewOfFolderType = tableView.tableQuery.type == TableQueryType.Folder;

    // Update tables in cache
    updateTablesInCache(tableView);

    const scenarioType = (tableView.tableQuery as MailFolderTableQuery).scenarioType;

    if (isTableViewOfFolderType) {
        const datapoint = returnTopExecutingActionDatapoint((dp: PerformanceDatapoint) => {
            return dp.eventName == 'SwitchMailFolder';
        });

        if (datapoint) {
            datapoint.addCustomProperty(
                'isCached',
                tableView.isInitialLoadComplete // table was loaded once before so its in the cache
            );
            datapoint.addCustomProperty('scenario', scenarioType);
        }
    }

    // If folder is paused and table has already been loaded, do not load rows
    if (
        isTableViewOfFolderType &&
        tableView.isInitialLoadComplete &&
        isFolderPaused(tableView.tableQuery.folderId)
    ) {
        return Promise.resolve();
    }

    const loadFromServerPromise =
        scenarioType === 'spotlight'
            ? lazyLoadImportantTable.importAndExecute(actionSource)
            : loadInitialRowsFromServer(
                  tableView,
                  false /* isTablePrefetched */,
                  onInitialTableLoadComplete,
                  initialSessionData,
                  apolloClientPromise
              );

    // Resolve the initial load promise immediately if we're showing cached items, otherwise resolve when the server returns results
    return tableView.isInitialLoadComplete ? Promise.resolve() : loadFromServerPromise;
}

const setCurrentLoadedIndex = mutatorAction('setCurrentLoadedIndex', (tableView: TableView) => {
    // load table from cache by setting the currentLoadedIndex
    tableView.currentLoadedIndex = Math.min(
        MAX_CACHED_ROWS_TO_SHOW_TABLE_LOAD,
        tableView.rowKeys.length
    );
});
