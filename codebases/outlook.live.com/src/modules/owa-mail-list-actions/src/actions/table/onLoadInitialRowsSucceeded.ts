import { MAX_CACHED_ROWS_TO_SHOW_TABLE_LOAD } from 'owa-mail-triage-table-utils';
import { mergeRowResponseFromTop } from 'owa-mail-list-response-processor';
import {
    MailListRowDataType,
    TableQueryType,
    TableView,
    canTableBeOutOfSyncWithServer,
} from 'owa-mail-list-store';
import type FolderId from 'owa-service/lib/contract/FolderId';
import { action } from 'satcheljs/lib/legacy';

/**
 * Callback when load initial rows request succeeds
 * @param tableView to load
 * @param newRows to be merged
 * @param newTotalRowsInView the number of new total rows
 * @param searchFolderId the searchFolderId contained in the response message
 */
export default action('onLoadInitialRowsSucceeded')(function onLoadInitialRowsSucceeded(
    tableView: TableView,
    newRows: MailListRowDataType[],
    newTotalRowsInView: number,
    searchFolderId: FolderId,
    folderId: FolderId
) {
    // In case of groups, we don't initially have the actual folder id when the tableView is created (similar to search folders in inbox),
    // So we get it in the response for findConversation call and update the serverFolderId.
    if (tableView.tableQuery.type == TableQueryType.Group && folderId) {
        tableView.serverFolderId = folderId.Id;
    }

    // If SearchFolderId is returned in response, set it on the tableView
    if (searchFolderId) {
        tableView.serverFolderId = searchFolderId.Id;
    }

    // Invalidate the remaining rows if the client table is out of sync with the server
    const shouldRemoveRemainingRowsAfterMerge = canTableBeOutOfSyncWithServer(tableView);

    // Update rows in listview store
    // also log isDataUptodate only if the table is not being loaded for first time
    mergeRowResponseFromTop(
        newRows,
        tableView,
        newTotalRowsInView,
        shouldRemoveRemainingRowsAfterMerge /* removeRemainingRowsAfterMerge */,
        tableView.isInitialLoadComplete /* shouldLogIsDataUptodate */,
        'MergeOnInitialRowsFetch'
    );

    // Set the loaded index to max allowed on initial table load
    tableView.currentLoadedIndex = Math.min(
        MAX_CACHED_ROWS_TO_SHOW_TABLE_LOAD,
        tableView.rowKeys.length
    );
});
