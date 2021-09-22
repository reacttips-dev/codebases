import { doesRowBelongToNudgeSection } from 'owa-mail-nudge-store';
import {
    MailRowDataPropertyGetter,
    TableView,
    getSortByForTable,
    MailSortHelper,
} from 'owa-mail-list-store';
import {
    getFirstUnpinnedRowIndex,
    shouldTableSortByRenewTime,
} from 'owa-mail-list-response-processor';

/**
 * Compare the date time of two rows
 * @param targetLastDeliveryOrRenewTimeStamp the lastDeliveryOrRenewTimeStamp of the conversation to insert
 * @param targetLastDeliveryTimeStamp the lastDeliveryTimeStamp of the conversation to insert
 * @param rowKeyOfReferenceRow the conversation rowKey of the reference row
 * @param tableView the table view
 * @returns
 * 1) < 0 if reference row is earlier than target row
 * 2) 0 if have the same time
 * 3) > 0 if reference row is later than target row
 */
function compareRowDateTime(
    targetLastDeliveryOrRenewTimeStamp: string,
    targetLastDeliveryTimeStamp: string,
    rowKeyOfReferenceRow: string,
    tableView: TableView
): number {
    const diffDeliveryUTCTime =
        new Date(
            MailRowDataPropertyGetter.getLastDeliveryTimeStamp(rowKeyOfReferenceRow, tableView)
        ).getTime() - new Date(targetLastDeliveryTimeStamp).getTime();

    if (shouldTableSortByRenewTime(tableView.tableQuery)) {
        // If table supports pin, use renew time as primary sort, and delivery time as secondary sort
        const diffRenewTimeInUTC =
            new Date(
                MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(
                    rowKeyOfReferenceRow,
                    tableView
                )
            ).getTime() - new Date(targetLastDeliveryOrRenewTimeStamp).getTime();
        return diffRenewTimeInUTC != 0 ? diffRenewTimeInUTC : diffDeliveryUTCTime;
    }

    return diffDeliveryUTCTime;
}

/**
 * Find the index to insert at for the row for which add/update notification has arrived.
 * @param lastDeliveryOrRenewTimeStamp the lastDeliveryOrRenewTimeStamp of the row to insert
 * @param lastDeliveryTimeStamp the lastDeliveryTimeStamp of the row to insert
 * @param tableView tableView where the row has to be inserted
 * @param startIndex the start index to scan from
 * @param rowKeyInPayload the instanceKey of the row payload
 * @returns insert index for the row
 */
export function findIndexToInsertAtUponRowUpdateNotification(
    lastDeliveryOrRenewTimeStamp: string,
    lastDeliveryTimeStamp: string,
    tableView: TableView,
    startIndex: number,
    rowKeyInPayload: string
) {
    // Should this row be in nudge section
    if (doesRowBelongToNudgeSection(rowKeyInPayload, tableView.id, lastDeliveryOrRenewTimeStamp)) {
        // always recalculate as it's possible an existing row has just been unpinned
        return getFirstUnpinnedRowIndex(tableView, 0 /* startIndex */);
    }

    // If the notification is not for the nudged-unpinned row find the ordered index
    return findOrderedIndexToInsertAt(
        lastDeliveryOrRenewTimeStamp,
        lastDeliveryTimeStamp,
        tableView,
        startIndex
    );
}

/**
 * Computes the insert index for the row in date view sort order
 * @param lastDeliveryOrRenewTimeStamp the lastDeliveryOrRenewTimeStamp of the row to insert
 * @param lastDeliveryTimeStamp the lastDeliveryTimeStamp of the row to insert
 * @param tableView tableView where the row has to be inserted
 * @param startIndex the start index to scan from
 * @returns insert index for the row, -1 if could not place the row
 */
export default function findOrderedIndexToInsertAt(
    lastDeliveryOrRenewTimeStamp: string,
    lastDeliveryTimeStamp: string,
    tableView: TableView,
    startIndex: number
): number {
    const tableLength = tableView.rowKeys.length;

    // Handle the case when tableView is empty
    // We will insert this item at index 0 to begin
    if (tableLength == 0) {
        return 0;
    }

    // Scan from top until we find row that's later\earlier than the row depending on the sort direction
    // VSO: 18945 - Add notification support for the multivalued sort
    const latestFirst =
        getSortByForTable(tableView).sortDirection == MailSortHelper.DESCENDING_SORT_DIR;
    let i;
    for (i = startIndex; i < tableLength; i++) {
        const rowKey = tableView.rowKeys[i];

        /**
         * If the row belongs to nudge section, skip comparing with its timestamp
         * as these rows are positioned out of date time sort order
         */
        if (doesRowBelongToNudgeSection(rowKey, tableView.id, lastDeliveryOrRenewTimeStamp)) {
            continue;
        }

        const rowDateTimeDiff = compareRowDateTime(
            lastDeliveryOrRenewTimeStamp,
            lastDeliveryTimeStamp,
            rowKey,
            tableView
        );

        if (latestFirst ? rowDateTimeDiff <= 0 : rowDateTimeDiff > 0) {
            return i;
        }
    }

    // There is no row in table that's earlier or later depending on the date time direction,
    // than the row to insert. This could happen if e.g user unpins an old conversation in date time
    // descending sort
    if (tableLength == tableView.totalRowsInView) {
        // Insert the row to the end of the table in case client has loaded all rows from server.
        return tableLength;
    }

    // If client does not have all rows loaded from the server tableLength will be less than the totalRowsInView.
    // In this case client cannot assume that the row getting inserted is at the end as the row's position could be anywhere
    // from the end index on the client till the end index on the server.
    // In such cases return -1.
    // VSO: 91173- [ListView] [Reliability] In case client fails to insert the row, should we reload the table..
    return -1;
}
