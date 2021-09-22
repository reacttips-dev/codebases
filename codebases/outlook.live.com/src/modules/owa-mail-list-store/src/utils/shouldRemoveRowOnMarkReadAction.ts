import { TableView, doesTableSupportAutoMarkRead } from '../index';

/**
 * Determines whether to remove the row from table when marked as read
 * @param tableView tableview where mark as read happened
 * @param isReadValue isRead value
 * @param isExplicit is the action was explicitly performed
 */
export default function shouldRemoveRowOnMarkReadAction(
    tableView: TableView,
    isReadValue: boolean,
    isExplicit: boolean
) {
    // Case 1 - Do not remove row for tables that support auto mark read
    if (doesTableSupportAutoMarkRead(tableView)) {
        return false;
    }

    // Case 2 - When table does not support auto mark read,
    // remove row only if user explicitly marks the row as read
    return isReadValue && isExplicit;
}
