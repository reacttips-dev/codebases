import type TableView from '../store/schema/TableView';
import RowOperation from '../store/schema/RowOperation';

/**
 * Set the current RowNotificationOperation on the table, indicating if the table is currently handling a specific
 * type of row notification
 * @param tableView - The tableView receiving notification
 * @param rowNotificationOperation - The RowNotificationOperation currently being handled
 */
export function setRowOperation(tableView: TableView, rowNotificationOperation: RowOperation) {
    tableView.currentRowOperation = rowNotificationOperation;

    // Always reset the RowOperation state after a promise resolve.
    // This will ensure that we won't have a stale out of sync state. Whatever state we set will be good for the synchronous
    // thread, and promise resolve will run afer the synchronous thread to clear the state.
    Promise.resolve().then(() => {
        tableView.currentRowOperation = RowOperation.None;
    });
}
