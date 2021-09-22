import doesTableSupportAutoMarkRead from './doesTableSupportAutoMarkRead';
import { getViewFilterForTable, TableView } from '../index';

/**
 * Determines whether the given table can be out of sync with the server
 * @param tableView tableView
 * @returns true if the table can be out of sync
 */
export default function canTableBeOutOfSyncWithServer(tableView: TableView) {
    // Currently the unread table that supports auto mark as read can be out of sync with the server
    return getViewFilterForTable(tableView) == 'Unread' && doesTableSupportAutoMarkRead(tableView);
}
