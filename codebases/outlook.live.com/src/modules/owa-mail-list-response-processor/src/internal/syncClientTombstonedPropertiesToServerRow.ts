import { default as syncClientPropertyToServerPayload } from './clientToServerPropertySyncManager';
import type { MailListRowDataType, TableView } from 'owa-mail-list-store';
import tombstoneOperations, { TombstoneReasonType } from 'owa-mail-list-tombstone';

/**
 * Function that syncs the properties that are tombstoned on client
 * @param serverRow row payload from server
 * @param tableView where the row belongs
 */
export default function syncClientTombstonedPropertiesToServerRow(
    serverRow: MailListRowDataType,
    tableView: TableView
): void {
    const instanceKey = serverRow.InstanceKey;
    const folderId = tableView.serverFolderId;
    // Clone array as the original will get altered in the for loop
    const tombstoneReasons = tombstoneOperations
        .getTombstonedReasons(instanceKey, folderId)
        .slice(0);
    if (!tombstoneReasons) {
        return;
    }

    for (const tombstoneReason of tombstoneReasons) {
        if (tombstoneReason == TombstoneReasonType.RowRemove) {
            throw new Error('syncTombstonedProperties should not be called for Remove reason');
        }

        /**
         * Try syncing the triage property value in the server row for tombstoneReason
         */
        const wasTriagePropertyValueInSync = syncClientPropertyToServerPayload(
            serverRow,
            tableView,
            tombstoneReason
        );

        /**
         * Remove the reason from tombstone for this row
         * if the property value is same for both client and server
         */
        if (wasTriagePropertyValueInSync) {
            tombstoneOperations.remove(instanceKey, folderId, tombstoneReason);
        }
    }
}
