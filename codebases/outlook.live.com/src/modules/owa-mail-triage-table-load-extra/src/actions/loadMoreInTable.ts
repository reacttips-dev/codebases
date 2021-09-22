import loadMoreConversationsFromServer from './helpers/loadMoreConversationsFromServer';
import loadMoreItemsFromServer from './helpers/loadMoreItemsFromServer';
import { TableQueryType, MailFolderTableQuery } from 'owa-mail-list-store';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { action } from 'satcheljs/lib/legacy';
import type { SearchTableQuery } from 'owa-mail-list-search';
import { onLoadMoreRowsFailed, onLoadMoreRowsSucceeded } from './helpers/onLoadMoreRowsCompleted';
import {
    lazyLoadMoreFindItemSearch,
    lazyLoadMoreSubstrateSearch,
} from 'owa-mail-execute-search-actions';
import { SearchProvider } from 'owa-search-service';

/* Number of additional rows to load when scrolling down in table */
export const LOAD_MORE_ROW_COUNT = 50;

/**
 * Load more rows from server to the given table
 * @param tableView to be loaded
 */
function loadMoreRowsFromServer(tableView: TableView) {
    tableView.isLoading = true;

    switch (tableView.tableQuery.listViewType) {
        case ReactListViewType.Conversation:
            loadMoreConversationsFromServer(tableView, LOAD_MORE_ROW_COUNT);
            break;

        case ReactListViewType.Message:
            loadMoreItemsFromServer(tableView, LOAD_MORE_ROW_COUNT);
            break;
    }
}

/**
 * Load more data in table
 * @param tableView to be loaded
 */
export default action('loadMoreInTable')(function loadMoreInTable(tableView: TableView) {
    if (!tableView) {
        throw new Error('Selected tableview must not be null if loadMoreRows is being called.');
    }

    if (tableView.currentLoadedIndex < tableView.rowKeys.length) {
        // We have items locally not yet rendered. Let's try to increase loaded range those before going to the server
        const localItemsLeft = tableView.rowKeys.length - tableView.currentLoadedIndex;
        if (localItemsLeft >= LOAD_MORE_ROW_COUNT) {
            // We have enough to satisfy current range, so render that. No need to go to the server
            tableView.currentLoadedIndex += LOAD_MORE_ROW_COUNT;
            return;
        }

        // We have more items locally, but not enough to satisfy current range.
        // Render what we have and also go to the server
        tableView.currentLoadedIndex = tableView.rowKeys.length;
    }

    if (
        (tableView.tableQuery.type == TableQueryType.Folder ||
            tableView.tableQuery.type == TableQueryType.Group) &&
        (tableView.tableQuery as MailFolderTableQuery).scenarioType !== 'spotlight'
    ) {
        loadMoreRowsFromServer(tableView);
    } else if (tableView.tableQuery.type === TableQueryType.Search) {
        const tableQuery = tableView.tableQuery as SearchTableQuery;

        if (tableQuery.searchProvider === SearchProvider.FindItem) {
            loadMoreSharedMailboxSearchResults(tableView);
        } else {
            loadMorePrimaryMailboxSearchResults(tableView);
        }
    }
});

const loadMoreSharedMailboxSearchResults = async (tableView: TableView) => {
    const loadMoreFindItemSearchAction = await lazyLoadMoreFindItemSearch.import();
    loadMoreFindItemSearchAction(
        tableView.currentLoadedIndex - 1 /* offset */,
        tableView,
        'loadMoreInTable' /* actionSource */,
        onLoadMoreRowsSucceeded,
        onLoadMoreRowsFailed
    );
};

const loadMorePrimaryMailboxSearchResults = async (tableView: TableView) => {
    const indexToFetch = tableView.rowKeys.length - 1;
    const tableQuery = tableView.tableQuery as SearchTableQuery;

    /**
     * If the index to fetch (next index in the table to start the page request
     * for) is greater than then the last index that was used to issue a page
     * request, then fetch more results.
     */
    if (indexToFetch > tableQuery.lastIndexFetched) {
        tableQuery.lastIndexFetched = indexToFetch;

        const loadMoreSubstrateSearch = await lazyLoadMoreSubstrateSearch.import();
        loadMoreSubstrateSearch(
            indexToFetch /* offset */,
            tableView,
            'loadMoreInTable',
            onLoadMoreRowsSucceeded,
            onLoadMoreRowsFailed
        );
    }
};
