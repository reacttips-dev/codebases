import type { ItemContext } from 'owa-mail-actions/lib/triage/deleteItemsStoreUpdate';
import { getRowKeysFromRowIds } from 'owa-mail-list-store';
import selectConversationById from 'owa-mail-list-store/lib/selectors/selectConversationById';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import getTableConversationRelation from 'owa-mail-list-store/lib/utils/getTableConversationRelation';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'removeSingleItemFromConversation',
    function removeSingleItemFromConversation(itemContext: ItemContext, tableViewId: string) {
        const tableView = listViewStore.tableViews.get(tableViewId);
        const rowKeys = getRowKeysFromRowIds([itemContext.itemConversationId.Id], tableView);
        for (const rowKey of rowKeys) {
            removeSingleItemFromConversationByRowKey(rowKey, itemContext, tableViewId);
        }
    }
);

function removeSingleItemFromConversationByRowKey(
    rowKey: string,
    itemContext: ItemContext,
    tableViewId: string
) {
    const conversationItem = selectConversationById(itemContext.itemConversationId.Id);
    const tableConversationRelation = getTableConversationRelation(rowKey, tableViewId);

    // Remove from ItemIds if found
    let removeAtIndex = tableConversationRelation.itemIds.indexOf(itemContext.itemId);
    if (removeAtIndex >= 0) {
        tableConversationRelation.itemIds.splice(removeAtIndex, 1);

        // Also update unread count
        if (!itemContext.isRead) {
            tableConversationRelation.unreadCount--;
        }
    }

    // Remove from GlobalItemIds if found
    removeAtIndex = conversationItem.globalItemIds.indexOf(itemContext.itemId);
    if (removeAtIndex >= 0) {
        conversationItem.globalItemIds.splice(removeAtIndex, 1);

        // Also update global unread count
        if (!itemContext.isRead) {
            conversationItem.globalUnreadCount--;
        }
    }

    // Remove from DraftItemIds if found
    removeAtIndex = tableConversationRelation.draftItemIds.indexOf(itemContext.itemId);
    if (removeAtIndex >= 0) {
        tableConversationRelation.draftItemIds.splice(removeAtIndex, 1);
    }
}
