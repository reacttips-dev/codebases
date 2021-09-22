import getAllTableViewsContainingItemsForFolder from 'owa-mail-triage-table-utils/lib/getAllTableViewsContainingItemsForFolder';
import type { ObservableMap } from 'mobx';
import type TableView from 'owa-mail-list-store/lib/store/schema/TableView';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import getSelectedTableViewId from 'owa-mail-list-store/lib/utils/getSelectedTableViewId';
import TableOperations from 'owa-mail-list-table-operations';
import tombstoneOperations from 'owa-mail-list-tombstone';
import { action } from 'satcheljs/lib/legacy';

export interface RemoveTableFromStoreState {
    tableViews: ObservableMap<string, TableView>;
}

/**
 * Remove a table from the store
 * @param tableViewId the table view id
 * @param state RemoveTableFromStoreState used for removeTableFromStore action
 */
export default action('removeTableFromStore')(function removeTableFromStore(
    tableViewId: string,
    state: RemoveTableFromStoreState = { tableViews: listViewStore.tableViews }
) {
    const { tableViews } = state;
    const tableView = tableViews.get(tableViewId);
    if (tableView) {
        // the selected table view should not be removed at any time
        // but there are rare chances of this happening as the remove is called asynchronously from the updateMRUCache code
        if (getSelectedTableViewId() == tableViewId) {
            return;
        }
        // remove all conversations in this table view
        // VSO - 15466 - [Perf] cleaning of a table should be done async , and optimize the amount of work it does
        TableOperations.clear(tableView, null /* skipRowsNewerThanTime*/);
        // remove the table view from store
        tableViews.delete(tableViewId);
        // If all tables for the folder have been removed, also clear the tombstone list for the folder
        if (
            getAllTableViewsContainingItemsForFolder(
                tableView.tableQuery.folderId,
                false /* shouldIncludeSearchTable */
            ).length == 0
        ) {
            tombstoneOperations.clearMapForFolder(tableView.serverFolderId);
        }
    }
});
