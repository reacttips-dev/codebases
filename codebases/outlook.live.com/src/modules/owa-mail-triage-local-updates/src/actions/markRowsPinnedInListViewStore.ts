import findIndexByInstanceKey from 'owa-mail-triage-table-utils/lib/findIndexByInstanceKey';
import findOrderedIndexToInsertAt from 'owa-mail-triage-table-utils/lib/findIndexToInsertAt';
import type { ObservableMap } from 'mobx';
import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';
import {
    RowOperation,
    setRowOperation,
    listViewStore,
    TableQueryType,
    TableView,
    getRowIdsFromRowKeys,
    getRowKeysFromRowIds,
    MailRowDataPropertyGetter,
} from 'owa-mail-list-store';
import TableOperations from 'owa-mail-list-table-operations';
import tombstoneOperations, { TombstoneReasonType } from 'owa-mail-list-tombstone';
import { trySelectNextRowUponTriageAction } from '../utils/trySelectNextRowUponTriageAction';

export interface MarkRowsAsPinnedState {
    tableViews: ObservableMap<string, TableView>;
}

/**
 * Move the target row to the index after pin/unpin
 * @param lastDeliveryOrRenewTimeStamp the last delivery or renew time of the target row data
 * @param lastDeliveryTimeStamp the last delivery time of target row data
 * @param tableView the table view
 * @param targetRowKey the target row id
 * @param shouldMarkAsPinned whether this is a pin action, otherwise unpin
 * @returns flag indicating whether a position was found for the row or not.
 */
function moveUpdatedRowInList(
    lastDeliveryOrRenewTimeStamp: string,
    lastDeliveryTimeStamp: string,
    tableView: TableView,
    targetRowKey: string,
    shouldMarkAsPinned: boolean
): boolean {
    const oldIndex = findIndexByInstanceKey(targetRowKey, tableView);

    // Remove row from old position in the list
    if (oldIndex < 0) {
        throw new Error('Row being pinned / unpinnned must exist in the list');
    }

    // Index to start search at. If we're pinning, start from top, if unpinning, it can only be moved
    // to at or below the old index
    let indexToInsertAt;
    const startIndex = shouldMarkAsPinned ? 0 : oldIndex + 1;

    indexToInsertAt = findOrderedIndexToInsertAt(
        lastDeliveryOrRenewTimeStamp,
        lastDeliveryTimeStamp,
        tableView,
        startIndex
    );

    if (oldIndex < indexToInsertAt) {
        // In case of unpin, decrease 1 index because indexToInsertAt is calculated based on that row
        // is still pinned in the table
        indexToInsertAt--;
    }

    if (indexToInsertAt == -1) {
        // Remove the row if could not place it, because the row could have moved down (and out of loaded range) for any reason from another client,
        // e.g unpin or delete the latest item in the conversation from another client
        removeRowsFromListViewStore([targetRowKey], tableView, 'Pin');
        return false;
    }

    TableOperations.updateRowPosition(indexToInsertAt, targetRowKey, tableView);
    return true;
}

/**
 * Mark the row pinned/unpinned in list view store
 * @param rowKeys the rowKeys to act upon
 * @param originalTableViewId the table view id
 * @param shouldMarkAsPinned whether this is a pin action, otherwise unpin
 * @param updateRenewTimeAction the delegate action which updates the row data's renew time
 */
export default function markRowsPinnedInListViewStore(
    rowKeys: string[],
    originalTableViewId: string,
    shouldMarkAsPinned: boolean,
    updateRenewTimeAction: (
        rowKey: string,
        tableViewId: string,
        shouldMarkAsPinned: boolean
    ) => void,
    state: MarkRowsAsPinnedState = { tableViews: listViewStore.tableViews }
) {
    const originalTableView = state.tableViews.get(originalTableViewId);
    if (originalTableView.tableQuery.type === TableQueryType.Folder) {
        // Add the rowKeys to tombstone so they don't pop back in.
        // This needs to be done first as the store update for pin may remove the row from table.
        // Only need to do this for folder table, which supports notification and pin/delete actions
        tombstoneOperations.add(rowKeys, originalTableView, TombstoneReasonType.Pin);
        // Select next row.
        // Skip this for other table, like search, as the row being pinned/unpinned never moves in the list
        trySelectNextRowUponTriageAction(rowKeys, originalTableView);
    }
    const rowIdStrings = getRowIdsFromRowKeys(rowKeys, originalTableViewId);
    rowIdStrings.forEach(rowId => {
        state.tableViews.forEach((tableView: TableView) => {
            if (tableView.tableQuery.folderId != originalTableView.tableQuery.folderId) {
                return;
            }
            const rowKeys = getRowKeysFromRowIds([rowId], tableView);
            rowKeys.forEach(rowKey => {
                updateRenewTimeAction(rowKey, tableView.id, shouldMarkAsPinned);
                // Only move the pinned row to the top if it's in a mail table.
                // For search table, we don't move the row after it's pinned.
                if (tableView.tableQuery.type === TableQueryType.Folder) {
                    // Treat this pinning operation as a row move operation.
                    // This is used to restore list view scroll position.
                    // Make sure the state is used synchronously on the current thread,
                    // The row operation is reset once we let go of the thread
                    setRowOperation(tableView, RowOperation.RowMove);
                    const foundPositionForRowMove = moveUpdatedRowInList(
                        MailRowDataPropertyGetter.getLastDeliveryOrRenewTimeStamp(
                            rowKey,
                            tableView
                        ),
                        MailRowDataPropertyGetter.getLastDeliveryTimeStamp(rowKey, tableView),
                        tableView,
                        rowKey,
                        shouldMarkAsPinned
                    );
                    // We could not find position for this row, override the entry in the tombstone map with delete operation
                    // Currently we tombstone rows only for the table where the action was taken
                    if (!foundPositionForRowMove && tableView.id == originalTableViewId) {
                        tombstoneOperations.add(
                            [rowKey],
                            originalTableView,
                            TombstoneReasonType.RowRemove
                        );
                    }
                }
            });
        });
    });
}
