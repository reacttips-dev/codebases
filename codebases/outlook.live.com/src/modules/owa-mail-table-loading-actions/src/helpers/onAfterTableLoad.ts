import { lazyMarkReadOnTableViewChange } from 'owa-mail-mark-read-actions';
import { TableQueryType, TableView } from 'owa-mail-list-store';
import { lazyCleanSearchTableState } from 'owa-mail-execute-search-actions';
import tombstoneOperations from 'owa-mail-list-tombstone';
import { returnTopExecutingActionDatapoint } from 'owa-analytics';

/**
 * Called after loading the new table. The reason we are passing the selectedRowKeys
 * and not reading them from the oldTableView is because the reset selection has already
 * been called in onBeforeTableLoad and it has to happen synchronously before the new
 * table loads else we end up in not resetting the LV/RP views in certain scenarios.
 * @param selectedRowKeysForOldTable the selectedRowKeys for the old tableview
 * @param oldTableView the old table view
 * @param newTableView the new tableView we are switching to
 */
export async function onAfterTableLoad(
    selectedRowKeysForOldTable: string[],
    oldTableView: TableView,
    newTableView: TableView
) {
    // Clear entries from the tombstone for the old table
    if (oldTableView.tableQuery.type === TableQueryType.Folder) {
        tombstoneOperations.clearMapForFolder(oldTableView.serverFolderId);
    }

    const markReadOnTableChange = await lazyMarkReadOnTableViewChange.import();
    markReadOnTableChange(selectedRowKeysForOldTable, oldTableView, newTableView);

    // Clean the old table View's state.
    // Currently we do not have to clean up anything on a non-search (or Folder) table
    // as we are caching them and the only clean up that we perform is the resetting the selection
    if (
        oldTableView.tableQuery.type === TableQueryType.Search &&
        oldTableView.id !== newTableView.id
    ) {
        const actionDatapoint = returnTopExecutingActionDatapoint();
        /**
         * The reason we want to wait on markReadOnTableChange promise is to make sure the
         * mark read operation completes correctly on the row that was selected in the search table,
         * before we try to clear the rows in the table
         */
        lazyCleanSearchTableState(oldTableView, actionDatapoint);
    }
}
