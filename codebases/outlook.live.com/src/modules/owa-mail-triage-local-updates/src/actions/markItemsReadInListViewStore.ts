import getAllTableViewsContainingItems from 'owa-mail-triage-table-utils/lib/getAllTableViewsContainingItems';
import type { ObservableMap } from 'mobx';
import {
    ConversationItem,
    listViewStore,
    TableView,
    getRowKeysFromRowIds,
} from 'owa-mail-list-store';
import getTableConversationRelation from 'owa-mail-list-store/lib/utils/getTableConversationRelation';
import type { ClientItem } from 'owa-mail-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import { action } from 'satcheljs/lib/legacy';
import shouldUpdateFolderCount from '../utils/shouldUpdateFolderCount';
import updateFolderCounts from 'owa-mail-actions/lib/updateFolderCounts';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

export interface MarkItemsReadInListViewStoreState {
    conversationItems: ObservableMap<string, ConversationItem>;
    items: ObservableMap<string, ClientItem>;
}

/**
 * Update the conversation relation unread count and the conversationItem's global unread count
 * @param conversationId the conversation id
 * @param tableViewId the table view id
 * @param shouldMarkAsRead the isRead value to set
 * @param conversationItems the item cache in mail store
 */
function rollUpUnreadCountChangeOnConversation(
    conversationId: string,
    tableView: TableView,
    shouldMarkAsRead: boolean,
    conversationItems: ObservableMap<string, ConversationItem>
) {
    // Get all the rowKeys for the given conversation and update the unread count all the relations
    const rowKeys = getRowKeysFromRowIds([conversationId], tableView);
    const tableViewId = tableView.id;
    rowKeys.forEach(rowKey => {
        const tableConversationRelation = getTableConversationRelation(rowKey, tableViewId);
        const conversationItem = conversationItems.get(conversationId);

        if (!tableConversationRelation) {
            // Early return if table doesn't have the conversation relation
            return;
        }

        if (shouldMarkAsRead) {
            tableConversationRelation.unreadCount--;
            conversationItem.globalUnreadCount--;
        } else {
            tableConversationRelation.unreadCount++;
            conversationItem.globalUnreadCount++;
        }
    });
}

/**
 * Mark the item read in list view store
 * @param itemIds the item ids to be marked as read/unread
 * @param shouldMarkAsRead the isRead value to set
 * @param state the MarkItemsReadInListViewStoreState
 */
export default action('MarkItemsReadInListViewStore')(function markItemsReadInListViewStore(
    tableView: TableView,
    itemIds: string[],
    shouldMarkAsRead: boolean,
    state: MarkItemsReadInListViewStoreState = {
        items: mailStore.items,
        conversationItems: listViewStore.conversationItems,
    }
): void {
    const unreadCountChange = shouldMarkAsRead ? -1 * itemIds.length : itemIds.length;
    const folderId = tableView.tableQuery.folderId;
    // If folder is under archive mailbox or shared folder, update unread/total count in folderstore
    shouldUpdateFolderCount(folderId) &&
        updateFolderCounts(
            unreadCountChange,
            0, // total count
            folderId,
            true
        );
    // Aggregate local updates to conversation only when user is in conversation view
    if (tableView.tableQuery.listViewType != ReactListViewType.Conversation) {
        return;
    }
    itemIds.forEach(itemId => {
        const item = state.items.get(itemId);
        // Proceed the logic if item is present in item cache, because it might be removed from by notification
        if (item) {
            const conversationId = item.ConversationId?.Id;
            const tableViewsForItem = getAllTableViewsContainingItems(
                item.MailboxInfo,
                item.ParentFolderId.Id,
                true /* shouldIncludeSearchTable */
            );
            // Update the conversation relation in all tables of the corresponding folder
            tableViewsForItem.forEach(tableView =>
                rollUpUnreadCountChangeOnConversation(
                    conversationId,
                    tableView,
                    shouldMarkAsRead,
                    state.conversationItems
                )
            );
        }
    });
});
