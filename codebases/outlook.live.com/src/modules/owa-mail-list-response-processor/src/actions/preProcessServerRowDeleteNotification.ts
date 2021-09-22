import {
    getViewFilterForTable,
    MailListRowDataType,
    TableView,
    doesTableSupportAutoMarkRead,
} from 'owa-mail-list-store';
import tombstoneOperations, { TombstoneReasonType } from 'owa-mail-list-tombstone';

/**
 * Pre-processes the delete notification
 * @param serverRow row payload from server
 * @param tableView to which the row belongs
 * @returns a flag indicating whether the row notification should be processed further or not
 */
export default function preProcessServerRowDeleteNotification(
    serverRow: MailListRowDataType,
    tableView: TableView
): boolean {
    const instanceKey = serverRow.InstanceKey;
    const folderId = tableView.serverFolderId;
    const tombstoneReasons = tombstoneOperations.getTombstonedReasons(instanceKey, folderId);

    /**
     * Always remove from tombstone as delete notification
     * supercedes all other reasons, so that we clean up the tombstone properly on delete
     */
    if (tombstoneReasons.indexOf(TombstoneReasonType.RowRemove) > -1) {
        tombstoneOperations.remove(instanceKey, folderId, TombstoneReasonType.RowRemove);
        return true;
    }

    /**
     * For unread filter we do not want to honor the server row delete notification if the row is
     * tombstoned for read reason and auto mark read is enabled.
     * IF the row is deleted from other client it shall get deleted
     * from unread filter when the notification is received for the corresponding All filter table.
     * @see removeRowsFromListViewStoreOrchestrator
     */
    if (
        getViewFilterForTable(tableView) === 'Unread' &&
        doesTableSupportAutoMarkRead(tableView) &&
        tombstoneReasons.indexOf(TombstoneReasonType.Read) > -1
    ) {
        tombstoneOperations.remove(instanceKey, folderId, TombstoneReasonType.Read);
        return false;
    }

    return true;
}
