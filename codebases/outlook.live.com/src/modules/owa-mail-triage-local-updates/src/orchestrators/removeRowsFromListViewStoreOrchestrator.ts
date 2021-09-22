import removeRowsFromListViewStoreInternal from '../actions/removeRowsFromListViewStoreInternal';
import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';
import getAllTableViewsContainingItemsForFolder from 'owa-mail-triage-table-utils/lib/getAllTableViewsContainingItemsForFolder';
import { orchestrator } from 'satcheljs';
import {
    getViewFilterForTable,
    getFocusedFilterForTable,
    getRowIdsFromRowKeys,
    getRowKeysFromRowIds,
} from 'owa-mail-list-store';

/**
 * Removes the given row from the list view store and selects the next row if needed.
 * @param rowKeys - the conversations to remove
 * @param tableView - the table to remove them from
 */
export default orchestrator(removeRowsFromListViewStore, actionMessage => {
    const { rowKeys, tableView, actionType, shouldRemoveFromAllTables } = actionMessage;
    const tableViewId = tableView.id;

    // 1. Remove the row from the table where the operation was performed
    // or the notification was received so that the row is immediately removed
    // Filter to rows that exist in this particular table
    const filteredRowKeys = rowKeys.filter(rowKey => tableView.rowKeys.indexOf(rowKey) >= 0);
    if (filteredRowKeys.length == 0) {
        // Nothing to remove
        return;
    }

    const rowIds = getRowIdsFromRowKeys(filteredRowKeys, tableViewId);
    removeRowsFromListViewStoreInternal(filteredRowKeys, tableView, actionType);

    // 2. If this removal was from 'All' filter table we can safely remove it from
    // other filtered tables for this table (with same focused view filter and inboxClassification filter).
    // This particularly will be useful when user has enabled auto read in unread filter and
    // has deleted emails from other client which he would expect to get deleted from unread filter as well
    if (getViewFilterForTable(tableView) == 'All' && shouldRemoveFromAllTables) {
        const allTableViewsToDeleteRowFrom = getAllTableViewsContainingItemsForFolder(
            tableView.tableQuery.folderId,
            false /* shouldIncludeSearchTable */
        );

        const focusedViewFilter = getFocusedFilterForTable(tableView);
        allTableViewsToDeleteRowFrom.forEach(tableViewToDeleteRowFrom => {
            // Do not operate again on the table where the action was taken as that is already taken care of in 1.
            // Do not operate if the table does not have same focusedViewFilter and inboxClassification filter values
            // E.g. We do not want to delete the row from Other pivot if it was deleted from Focused.
            if (
                tableViewId == tableViewToDeleteRowFrom.id ||
                focusedViewFilter !== getFocusedFilterForTable(tableViewToDeleteRowFrom)
            ) {
                return;
            }

            const rowKeysForRowIds = getRowKeysFromRowIds(rowIds, tableViewToDeleteRowFrom);
            if (rowKeysForRowIds.length == 0) {
                return;
            }
            removeRowsFromListViewStoreInternal(
                rowKeysForRowIds,
                tableViewToDeleteRowFrom,
                actionType
            );
        });
    }
});
