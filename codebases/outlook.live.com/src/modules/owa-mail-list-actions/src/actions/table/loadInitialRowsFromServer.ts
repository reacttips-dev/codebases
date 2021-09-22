import loadInitialConversationsFromServer from './helpers/loadInitialConversationsFromServer';
import loadInitialItemsFromServer from './helpers/loadInitialItemsFromServer';
import { LoadErrorStatus, TableView } from 'owa-mail-list-store';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { trace } from 'owa-trace';
import { mutatorAction } from 'satcheljs';
import type { OnInitialTableLoadComplete } from 'owa-mail-loading-action-types';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { temp_getApolloClientAsync } from 'owa-apollo';

/**
 * @param tableView to load rows in
 * @param OnInitialTableLoadComplete is a callback that is called when we receive the response
 * The callback is handled by table loading
 * @param isTablePrefetched indicates if the table is prefetched
 * @return a promise that resolves when the load table from server has completed
 */
export default function loadInitialRowsFromServer(
    tableView: TableView,
    isTablePrefetched: boolean,
    onInitialTableLoadComplete: OnInitialTableLoadComplete,
    initialSessionData?: SessionData,
    apolloClientPromise?: Promise<ApolloClient<NormalizedCacheObject>>
): Promise<void> {
    setTableViewLoading(tableView);

    // we are going to call temp_getApolloClientAsync here so we can get a call stack
    // closer to where this is happening
    apolloClientPromise = apolloClientPromise || temp_getApolloClientAsync('linrfs');
    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            return loadInitialConversationsFromServer(
                tableView,
                isTablePrefetched,
                onInitialTableLoadComplete,
                initialSessionData,
                apolloClientPromise
            );

        case ReactListViewType.Message:
            return loadInitialItemsFromServer(
                tableView,
                isTablePrefetched,
                onInitialTableLoadComplete,
                initialSessionData,
                apolloClientPromise
            );

        default:
            trace.warn('listViewType: ' + tableView.tableQuery.listViewType + ' is not supported.');
            return Promise.resolve();
    }
}

const setTableViewLoading = mutatorAction('setTableViewLoading', (tableView: TableView) => {
    tableView.isLoading = true;
    tableView.loadErrorStatus = LoadErrorStatus.None;
});
