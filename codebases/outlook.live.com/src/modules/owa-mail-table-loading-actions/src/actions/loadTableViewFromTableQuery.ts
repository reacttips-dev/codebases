import { getTableViewFromTableQuery } from 'owa-mail-triage-table-utils';
import onInitialTableLoadComplete from './onInitialTableLoadComplete';
import type { PerformanceDatapoint } from 'owa-analytics';
import { lazyLoadSearchTable } from 'owa-mail-execute-search-actions';
import loadInitialGroupTable from 'owa-mail-list-actions/lib/actions/table/loadInitialGroupTable';
import loadInitialMailTable from 'owa-mail-list-actions/lib/actions/table/loadInitialMailTable';
import onLoadInitialRowsSucceeded from 'owa-mail-list-actions/lib/actions/table/onLoadInitialRowsSucceeded';
import getSelectedTableView from 'owa-mail-list-store/lib/utils/getSelectedTableView';
import { ActionSource, MailListItemSelectionSource } from 'owa-mail-store';
import getPersonaPhotoQueue from 'owa-persona/lib/actions/getPersonaPhotoQueue';
import { mutatorAction } from 'satcheljs';
import { listViewStore, TableQuery, TableQueryType } from 'owa-mail-list-store';
import { onAfterTableLoad } from '../helpers/onAfterTableLoad';
import { resetSelection } from 'owa-mail-actions/lib/mailListSelectionActions';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { temp_getApolloClientAsync } from 'owa-apollo';

/**
 * Load the table from the table query
 * @param tableQuery the table query
 * @param loadTableViewDatapoint - performance datapoint that starts when the user initiates the table load
 * @param actionSource action that initiated the switch folder action
 * @return a promise that resolves when the load table from server has completed
 */
export default function loadTableViewFromTableQuery(
    tableQuery: TableQuery,
    loadTableViewDatapoint?: PerformanceDatapoint,
    actionSource?: ActionSource,
    initialSessionData?: SessionData,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
): Promise<void> {
    const oldTableView = getSelectedTableView();
    const newTableView = getTableViewFromTableQuery(tableQuery);
    // Use the reference from the store (http://aka.ms/mobx4)
    tableQuery = newTableView.tableQuery;
    // 1. Set the current selected table in list view store to the new table
    setSelectedTableViewId(newTableView.id);
    // Store selectedRowKeys for old table before clearing the selection
    let selectedRowKeysForOldTable = [];
    // 2. Call onBeforeTableLoad before loading new table
    if (oldTableView) {
        // oldTableView is null when first loading OWA as there is no previously selected table
        selectedRowKeysForOldTable = [...oldTableView.selectedRowKeys.keys()];
        // always clear the getPersonaPhotoQueue when switching the table
        getPersonaPhotoQueue.clear();
        // Always reset/clear the selection on the old table.
        resetSelection(oldTableView, MailListItemSelectionSource.Reset);
    }
    // 3. Load New Table
    let loadTablePromise: Promise<void>;
    switch (tableQuery.type) {
        case TableQueryType.Search:
            loadTablePromise = lazyLoadSearchTable.importAndExecute(
                newTableView,
                onInitialTableLoadComplete,
                onLoadInitialRowsSucceeded,
                actionSource,
                loadTableViewDatapoint
            );
            break;
        case TableQueryType.Group:
            loadTablePromise = loadInitialGroupTable(
                newTableView,
                onInitialTableLoadComplete,
                actionSource
            );
            break;
        case TableQueryType.Folder:
            loadTablePromise = loadInitialMailTable(
                newTableView,
                onInitialTableLoadComplete,
                actionSource,
                initialSessionData,
                apolloClientPromise || temp_getApolloClientAsync('ltvftq')
            );
            break;
        default:
            throw new Error('UnsupportedTableQueryType');
    }
    // 4. Call onAfterTableLoad after loading new table
    if (oldTableView) {
        onAfterTableLoad(selectedRowKeysForOldTable, oldTableView, newTableView);
    }
    return loadTablePromise;
}

const setSelectedTableViewId = mutatorAction('setSelectedTableViewId', (id: string) => {
    listViewStore.selectedTableViewId = id;
});
