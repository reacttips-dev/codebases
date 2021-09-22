import removeSingleItemFromConversation from '../actions/mutators/removeSingleItemFromConversationMutator';
import getAllTableViewsContainingItems from 'owa-mail-triage-table-utils/lib/getAllTableViewsContainingItems';
import {
    TableQueryType,
    TableView,
    getTableConversationRelation,
    getRowKeysFromRowIds,
    isConversationView,
    listViewStore,
} from 'owa-mail-list-store';
import tombstoneOperations, { TombstoneReasonType } from 'owa-mail-list-tombstone';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import deleteItemsStoreUpdate, {
    ItemContext,
} from 'owa-mail-actions/lib/triage/deleteItemsStoreUpdate';
import { createLazyOrchestrator } from 'owa-bundling';
import removeRowsFromListViewStoreInternal from '../actions/removeRowsFromListViewStoreInternal';
import { isFirstLevelExpanded } from 'owa-mail-list-store/lib/selectors/isConversationExpanded';

export default createLazyOrchestrator(
    deleteItemsStoreUpdate,
    'clone_deleteItemsStoreUpdate',
    actionMessage => {
        const firstItemContext = actionMessage.itemContexts[0];
        const tableViews = getAllTableViewsContainingItems(
            firstItemContext?.mailboxInfo,
            actionMessage.parentFolderId,
            true /* shouldIncludeSearchTable */
        );

        for (const tableView of tableViews) {
            if (isConversationView(tableView)) {
                removeItemsInConversationTable(actionMessage.itemContexts, tableView);
            } else if (tableView.tableQuery.listViewType == ReactListViewType.Message) {
                removeItemsInMessageTable(actionMessage.itemContexts, tableView);
            }
        }
    }
);

function removeItemsInMessageTable(itemContexts: ItemContext[], tableView: TableView) {
    const rowIds: string[] = itemContexts.map(itemContext => {
        return itemContext.itemId;
    });
    const rowKeys = getRowKeysFromRowIds(rowIds, tableView);

    // Filter to items that exist in this particular table
    const filteredRowKeys = rowKeys.filter(rowKey => tableView.rowKeys.indexOf(rowKey) >= 0);
    if (filteredRowKeys.length == 0) {
        // Nothing to remove
        return;
    }

    removeRowsFromListViewStoreInternal(filteredRowKeys, tableView);

    // Add deleted instanceKeys to tombstones so they don't pop back in
    addRowKeysToTombstone(tableView, rowKeys);
}

function removeItemsInConversationTable(itemContexts: ItemContext[], tableView: TableView) {
    for (const itemContext of itemContexts) {
        const conversationRowKeys = getRowKeysFromRowIds(
            [itemContext.itemConversationId.Id],
            tableView
        );
        for (const conversationRowKey of conversationRowKeys) {
            const tableConversationRelation = getTableConversationRelation(
                conversationRowKey,
                tableView.id
            );
            if (!tableConversationRelation) {
                // This item was not found in the current table, noop
                continue;
            }

            const isFirstLevel = isFirstLevelExpanded(conversationRowKey);

            // If it is first level expanded and there is only one fork left
            // or if it is not first level expanded and there is only one item left
            // Remove the row, otherwise, remove the single item
            if (
                (isFirstLevel &&
                    listViewStore.expandedConversationViewState.forks.length == 1 &&
                    listViewStore.expandedConversationViewState.forks[0].id ==
                        itemContext.itemId) ||
                (!isFirstLevel &&
                    tableConversationRelation.itemIds.length == 1 &&
                    tableConversationRelation.itemIds[0] == itemContext.itemId)
            ) {
                removeRowsFromListViewStoreInternal([conversationRowKey], tableView);

                // Add deleted instanceKeys to tombstones so they don't pop back in
                addRowKeysToTombstone(tableView, [conversationRowKey]);
            } else {
                removeSingleItemFromConversation(itemContext, tableView.id);
            }
        }
    }
}

function addRowKeysToTombstone(tableView: TableView, rowKeys: string[]) {
    // Add deleted instanceKeys to tombstones so they don't pop back in
    // Only need to do this for mail folder and group queries which supports notifications and pin(folderOnly)/delete actions
    if (
        tableView.tableQuery.type === TableQueryType.Folder ||
        tableView.tableQuery.type === TableQueryType.Group
    ) {
        tombstoneOperations.add(rowKeys, tableView, TombstoneReasonType.RowRemove);
    }
}
