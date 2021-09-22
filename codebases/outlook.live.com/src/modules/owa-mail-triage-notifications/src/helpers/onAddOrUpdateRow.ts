import { userDate, isAfter } from 'owa-datetime';
import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';
import rowUpdatedUponNotification from 'owa-mail-actions/lib/triage/rowUpdatedUponNotification';
import updateRollupOnAddOrUpdateRowNotification from 'owa-mail-focused-inbox-rollup-store/lib/actions/updateRollupOnAddOrUpdateRowNotification';
import {
    fetchRichContentForRows,
    preProcessServerRowPayload,
    isRowSortKeyEqual,
    getDateSortTimeStampFromRowData,
} from 'owa-mail-list-response-processor';
import TableOperations from 'owa-mail-list-table-operations';
import { lazyPrefetchSingleRow } from 'owa-mail-prefetch';
import findIndexByInstanceKey from 'owa-mail-triage-table-utils/lib/findIndexByInstanceKey';
import { findIndexToInsertAtUponRowUpdateNotification } from 'owa-mail-triage-table-utils/lib/findIndexToInsertAt';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { action } from 'satcheljs/lib/legacy';
import {
    getFocusedFilterForTable,
    MailListRowDataType,
    RowOperation,
    TableView,
    isFolderPaused,
    listViewStore,
    setRowOperation,
    MailRowDataPropertyGetter,
    getTableConversationRelation,
} from 'owa-mail-list-store';
import { mailStore } from 'owa-mail-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { lazyFetchSpotlightItems } from 'owa-mail-spotlight';

/**
 * Performs update for a row that already exists on the table
 * @param row being updated
 * @param tableView where the row is updated
 * @param indexToInsertAt the index to insert the row at
 */
function updateExistingRow(
    row: MailListRowDataType,
    tableView: TableView,
    indexToInsertAt: number
) {
    const isSortKeyEqual = isRowSortKeyEqual(row, tableView);
    if (isSortKeyEqual) {
        // Only update data if sort key is the same
        TableOperations.updateRowData(row, tableView);
        setRowOperation(tableView, RowOperation.RowUpdateInPlace);
    } else {
        // Update data and row position otherwise
        TableOperations.updateRow(indexToInsertAt, row, tableView, 'RowUpdateNotification');
        setRowOperation(tableView, RowOperation.RowMove);
    }

    rowUpdatedUponNotification(row.InstanceKey, tableView);
}

/**
 * Inserts a new row that does not exist on the table
 * @param row being updated
 * @param tableView where the row is updated
 * @param indexToInsertAt - the index to insert the row at
 */
function addNewRow(row: MailListRowDataType, tableView: TableView, indexToInsertAt: number) {
    TableOperations.addRow(indexToInsertAt, row, tableView, 'RowAddNotification');
    setRowOperation(tableView, RowOperation.RowAdd);

    // Also increment current loaded index so the new row will be guaranteed to show up in the view
    // without bumping out an existing item
    tableView.currentLoadedIndex++;
}

/**
 * This function handles rowAdd and rowModified notifications.
 * @param row present in the notification
 * @param tableView for which notification has arrived
 */
function tryProcessSpotlightData(row: MailListRowDataType, tableView: TableView) {
    // If it is a spotlight item that is not on our store
    if (isFeatureEnabled('tri-spotlight2')) {
        let islocalItemSpotlightVisible;
        const listViewType = tableView.tableQuery.listViewType;
        if (listViewType === ReactListViewType.Message) {
            const rowId = MailRowDataPropertyGetter.getRowClientItemId(row.InstanceKey, tableView);
            const item = mailStore.items.get(rowId?.Id);
            islocalItemSpotlightVisible = item?.SpotlightIsVisible;
        } else {
            const tableConversationRelation = getTableConversationRelation(
                row.InstanceKey,
                tableView.id
            );

            islocalItemSpotlightVisible = tableConversationRelation?.spotlightIsVisible;
        }

        // We fetch items if the item/conversation became Spotlit or the opposite
        // when comparing to our store current state
        if (
            (row.SpotlightIsVisible && !islocalItemSpotlightVisible) ||
            (!row.SpotlightIsVisible && islocalItemSpotlightVisible)
        ) {
            lazyFetchSpotlightItems.importAndExecute();
        }
    }
}

/**
 * This function handles rowAdd and rowModified notifications.
 * @param row present in the notification
 * @param tableView for which notification has arrived
 */
export default action('rowNotificationHandler.onAddOrUpdateRow')(function onAddOrUpdateRow(
    row: MailListRowDataType,
    tableView: TableView
) {
    const instanceKey = row.InstanceKey;
    if (!instanceKey) {
        throw new Error('onAddOrUpdateNotification: Row instanceKey should not be null');
    }

    // Pre-process server row and determine whether to consume it further
    const shouldProcessPayload = preProcessServerRowPayload(row, tableView);
    if (!shouldProcessPayload) {
        return;
    }

    // Compute the insert index by passing in the lastDeliveryOrRenewTimeStamp and lastDeliveryTimeStamp.
    // Cannot use MailRowDataPropertyGetter here because the row hasn't been saved to item cache yet.
    const { lastDeliveryOrRenewTimeStamp, lastDeliveryTimeStamp } = getDateSortTimeStampFromRowData(
        row,
        tableView.tableQuery.listViewType
    );

    let indexToInsertAt = findIndexToInsertAtUponRowUpdateNotification(
        lastDeliveryOrRenewTimeStamp,
        lastDeliveryTimeStamp,
        tableView,
        0 /* startIndex */,
        instanceKey
    );

    const indexOfElement = findIndexByInstanceKey(instanceKey, tableView);
    const isRowAlreadyPresent = indexOfElement >= 0;

    if (indexToInsertAt == -1) {
        if (isRowAlreadyPresent) {
            // Remove the row if could not place it, because the row could have moved down (and out of loaded range) for any reason from another client,
            // e.g unpin a row or delete the latest item in the conversation from another client
            removeRowsFromListViewStore([instanceKey], tableView, 'UpdateNotification');
        }

        // Ignore the notification if we could not find an index to insert it
        return;
    }

    // Do not add row if inbox is paused and the time of the message is after the time the user paused. However, messages
    // with an earlier timestamp like those that were deleted and then undoed or older messages moved in from another folder should be allowed in.
    if (
        isFolderPaused(tableView.tableQuery.folderId) &&
        isAfter(userDate(lastDeliveryTimeStamp), listViewStore.inboxPausedDateTime)
    ) {
        return;
    }

    // Since this needs data from the notification and
    // current store data, we need to call it before we update
    // local store/data
    tryProcessSpotlightData(row, tableView);

    if (isRowAlreadyPresent) {
        if (indexOfElement < indexToInsertAt) {
            // If we're moving an existing item down in the list, decrease index to insert by 1 to account for the row being
            // removed from above the indexToInsertAt.  This should be done after all calculation for indexToInsertAt are done.
            indexToInsertAt--;
        }

        updateExistingRow(row, tableView, indexToInsertAt);
    } else {
        addNewRow(row, tableView, indexToInsertAt);
    }

    // Always pre-fetch if we're getting a row update because we don't want an entry in our data cache to go stale
    lazyPrefetchSingleRow.importAndExecute(instanceKey, tableView, true /* updateIfExists */);

    // Update focused inbox rollup data for Focused/Other notifications
    if (getFocusedFilterForTable(tableView) != FocusedViewFilter.None) {
        updateRollupOnAddOrUpdateRowNotification(tableView);
    }

    // FetchRichContentForRows
    fetchRichContentForRows(tableView);
});
