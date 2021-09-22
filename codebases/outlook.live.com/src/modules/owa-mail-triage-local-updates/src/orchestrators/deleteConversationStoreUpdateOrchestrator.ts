import { createLazyOrchestrator } from 'owa-bundling';
import deleteConversationStoreUpdate from 'owa-mail-actions/lib/triage/deleteConversationStoreUpdate';
import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';
import updateFolderCounts from 'owa-mail-actions/lib/updateFolderCounts';
import { getRowKeysFromRowIds, TableQueryType, TableView } from 'owa-mail-list-store';
import getTableConversationRelation from 'owa-mail-list-store/lib/utils/getTableConversationRelation';
import tombstoneOperations, { TombstoneReasonType } from 'owa-mail-list-tombstone';
import type { ActionType } from 'owa-mail-actions/lib/triage/userMailInteractionAction';

/**
 * Returns a couple sums based on a given set of conversations. Works like Array.prototype.reduce.
 * @param rowKeys - the rowKeys that are being acted upon
 * @param tableViewId - the table the conversations are from
 * @returns the totalCountChange and unreadCountChange via the batchState accumulator
 */
function countTotalUnreadChanges(rowKeys: string[], tableViewId: string): number[] {
    let unreadCountChange = 0;
    let totalCountChange = 0;
    const rowIdsVisisted = new Map();

    for (let i = 0; i < rowKeys.length; i++) {
        const rowKey = rowKeys[i];
        const tableConversationRelation = getTableConversationRelation(rowKey, tableViewId);
        if (!rowIdsVisisted.get(tableConversationRelation.id)) {
            rowIdsVisisted.set(tableConversationRelation.id, true);
            unreadCountChange -= tableConversationRelation.unreadCount;
            totalCountChange -= tableConversationRelation.itemIds.length;
        }
    }

    return [unreadCountChange, totalCountChange];
}

/**
 * Handles removing a collection of conversations from a given table view.
 * @param conversationIds - a collection of conversationIds to remove from a given table view
 * @param tableView - the table view to remove the conversations from
 */
export function handleRemoveConversationsFromTableView(
    conversationIds: string[],
    tableView: TableView,
    actionType: ActionType
) {
    const tableViewId = tableView.id;
    const allRowKeys = getRowKeysFromRowIds(conversationIds, tableView);

    if (allRowKeys.length == 0) {
        // Do not proceed if there is nothing to delete from the table.
        // Triage actions are lazy loaded and also in some cases we show confirm dialog
        // before performing the action.
        // Due to these async operations there are chances that when we are trying to make a local
        // removal of a row the row has already been removed from the table, due to operations such
        // as notifications, table getting removed from the store.
        return;
    }

    // Update local unread counts
    const totalCountChanges = countTotalUnreadChanges(allRowKeys, tableViewId);
    updateFolderCounts(
        totalCountChanges[0] /* unreadCountChange */,
        totalCountChanges[1] /* totalCountChange */,
        tableView.serverFolderId,
        true /* isDeltaChange */
    );

    // Add deleted InstanceKeys to tombstones so they don't pop back in
    // Add row to tombstone, only for mail folder and group queries which will support notifications.
    if (
        tableView.tableQuery.type == TableQueryType.Folder ||
        tableView.tableQuery.type == TableQueryType.Group
    ) {
        tombstoneOperations.add(allRowKeys, tableView, TombstoneReasonType.RowRemove);
    }

    removeRowsFromListViewStore(allRowKeys, tableView, actionType);
}

export const deleteConversationStoreUpdateOrchestrator = createLazyOrchestrator(
    deleteConversationStoreUpdate,
    'deleteConversationStoreUpdateClone',
    actionMessage => {
        const { conversationIds, tableView, actionType } = actionMessage;
        handleRemoveConversationsFromTableView(conversationIds, tableView, actionType);
    }
);
