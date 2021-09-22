import { tryLoadMoreUponRowRemove } from 'owa-mail-triage-table-load-extra';
import { selectNewItemUponRowRemoval } from 'owa-mail-actions/lib/mailListSelectionActions';
import { MailRowDataPropertyGetter, TableView } from 'owa-mail-list-store';
import TableOperations from 'owa-mail-list-table-operations';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import updateTableCurrentLoadedIndex from 'owa-mail-triage-table-utils/lib/actions/updateTableCurrentLoadedIndex';
import getSelectedTableViewId from 'owa-mail-list-store/lib/utils/getSelectedTableViewId';
import closeImmersiveReadingPane from 'owa-mail-actions/lib/closeImmersiveReadingPane';
import { isImmersiveReadingPaneShown } from 'owa-mail-layout/lib/selectors/isImmersiveReadingPaneShown';

/**
 * Internal function that removes the row from the table and performs
 * - load more if required
 * - selects next row if required
 * @param rowKeys row keys removed from the tableView
 * @param tableView tableView from where the row keys need to be removed
 */
export default function removeRowsFromListViewStoreInternal(
    rowKeys: string[],
    tableView: TableView,
    actionType: string = 'LocalUpdate'
) {
    // We want to keep focus where the user is currently triaging things.
    // So here we need to select the next row if the current row being removed is part of the selected rows.
    let rowIndex = -1;
    let lastSelectedRowWasPinned = false;
    let selectedRowKeysHasRow = false;
    for (const rowKey of rowKeys) {
        // Store the index of the selectedRowKey
        if (tableView.selectedRowKeys.has(rowKey)) {
            rowIndex = tableView.rowKeys.indexOf(rowKey);
            selectedRowKeysHasRow = true;

            // Keep track of the pinned status of the row before we remove it below. We'll
            // use it to make a decision on selecting the appropriate row upon removal
            if (rowIndex > -1) {
                lastSelectedRowWasPinned = MailRowDataPropertyGetter.getIsPinned(
                    tableView.rowKeys[rowIndex],
                    tableView
                );
            }
        }

        // Remove the row from the list view store
        TableOperations.removeRow(rowKey, tableView, actionType);
    }

    // Update currentLoadedIndex so that it's not greater than the rows we have
    updateTableCurrentLoadedIndex(
        tableView.id,
        Math.min(tableView.currentLoadedIndex, tableView.rowKeys.length)
    );

    if (tableView.id === getSelectedTableViewId()) {
        // Load more as needed since we removed some rows from view
        tryLoadMoreUponRowRemove(tableView);

        // Follow through with selecting the next row if
        // 1. If the row deleted was selected AND
        // 2. Folder is not the junk folder AND
        // 3. Check if there are any items after deletion.
        // else, close the reading pane if the user is in single line view.
        if (
            rowIndex > -1 &&
            tableView.tableQuery.folderId != folderNameToId('junkemail') &&
            tableView.rowKeys.length > 0
        ) {
            selectNewItemUponRowRemoval(tableView, rowIndex, lastSelectedRowWasPinned);
        } else {
            if (isImmersiveReadingPaneShown() && selectedRowKeysHasRow) {
                closeImmersiveReadingPane();
            }
        }
    }
}
