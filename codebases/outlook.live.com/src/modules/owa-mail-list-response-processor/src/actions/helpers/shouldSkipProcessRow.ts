import getDateSortTimeStampFromRowData from './getDateSortTimeStampFromRowData';
import tombstoneOperations, { TombstoneReasonType } from 'owa-mail-list-tombstone';
import type { MailListRowDataType, TableView } from 'owa-mail-list-store';

/**
 * Function that evaluates if the row payload should be processed when it is
 * received from the server, whether from notification or from Find calls
 * @param serverRow row payload received from server
 * @param tableView to which the row belongs
 * @returns a flag indicating whether the row should be processed further or not
 */
export default function shouldSkipProcessRow(
    serverRow: MailListRowDataType,
    tableView: TableView
): boolean {
    /**
     * Do not process the row if it was earlier than the lastEmptiedTime
     * in case we did an empty folder in this tableView.
     */
    const timeStamp = getDateSortTimeStampFromRowData(serverRow, tableView.tableQuery.listViewType);
    if (
        tableView.lastEmptiedTime &&
        tableView.lastEmptiedTime > new Date(timeStamp.lastDeliveryTimeStamp)
    ) {
        return true;
    }

    /**
     * Row is in tombstoned for remove reason so do not process it further
     */
    const tombstoneReasons = tombstoneOperations.getTombstonedReasons(
        serverRow.InstanceKey,
        tableView.serverFolderId
    );

    return tombstoneReasons.indexOf(TombstoneReasonType.RowRemove) > -1;
}
