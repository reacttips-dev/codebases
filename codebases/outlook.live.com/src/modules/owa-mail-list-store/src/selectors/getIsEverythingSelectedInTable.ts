import { TableQueryType, TableView } from '../index';

/**
 * Gets whether the everything is selected in table
 * @param tableView the table view
 * @return true if everything is selected in the table, false otherwise
 */
export default function getIsEverythingSelectedInTable(tableView: TableView): boolean {
    const {
        isInVirtualSelectAllMode,
        virtualSelectAllExclusionList,
        selectedRowKeys,
        rowKeys,
        totalRowsInView,
        tableQuery,
        isInCheckedMode,
    } = tableView;

    if (isInVirtualSelectAllMode) {
        // Always return true if user is in virtual select all mode and there are no unchecked rows (exclusion list has rows).
        // Otherwise if a user is in select all mode and loads more items, it would switch to multi-select mode
        // and update command bar to show different items
        return virtualSelectAllExclusionList.length === 0;
    }

    // VSO 17775: remove checking search table query after fixing 17775
    if (rowKeys.length == totalRowsInView || tableQuery.type == TableQueryType.Search) {
        // If client has all items or table is a search table, returns true if tableView is in multi-select mode and
        // all items are in real selection.
        return isInCheckedMode && selectedRowKeys.size == rowKeys.length;
    }

    return false;
}
