import type { ObservableMap } from 'mobx';
import updateFolderCounts from 'owa-mail-actions/lib/updateFolderCounts';
import getAllTableViewsContainingItemsForFolder from 'owa-mail-triage-table-utils/lib/getAllTableViewsContainingItemsForFolder';
import { action } from 'satcheljs/lib/legacy';
import {
    ConversationItem,
    listViewStore,
    TableViewConversationRelation,
    TableView,
    getTableConversationRelation,
} from 'owa-mail-list-store';

export interface MarkConversationReadInListViewStoreState {
    conversationItems: ObservableMap<string, ConversationItem>;
}

export default action('MarkConversationReadInListViewStore')(
    function markConversationReadInListViewStore(
        rowKeys: string[],
        shouldMarkAsRead: boolean,
        tableView: TableView,
        shouldUpdateFolderCounts: boolean,
        state: MarkConversationReadInListViewStoreState = {
            conversationItems: listViewStore.conversationItems,
        }
    ): void {
        let totalUnreadCountChange = 0;
        const rowIdsVisited: {
            [id: string]: boolean;
        } = {};
        // Update unread count in each table view conversation relations in the current table view
        rowKeys.forEach(rowKey => {
            if (tableView.virtualSelectAllExclusionList.indexOf(rowKey) >= 0) {
                return;
            }
            const tableConversationRelation = getTableConversationRelation(rowKey, tableView.id);
            const unreadCountChange = calculateUnreadCountChange(
                tableConversationRelation,
                shouldMarkAsRead
            );
            // Update the unread count and global unread count
            tableConversationRelation.unreadCount += unreadCountChange;
            const rowId = tableConversationRelation.id;
            const conversationItem = state.conversationItems.get(rowId);
            conversationItem.globalUnreadCount += unreadCountChange;
            // Update the total unread count change to be used by the folder stitch.
            // Skip the rows that have duplicate rowIds (conversationId) else as
            // these rows will have same unread count
            if (!rowIdsVisited[rowId]) {
                rowIdsVisited[rowId] = true;
                totalUnreadCountChange += unreadCountChange;
            }
            // Update read status in other tables that belong to the folder.
            updateAdditionalTables(rowKey, shouldMarkAsRead, tableView);
        });
        if (shouldUpdateFolderCounts) {
            // Get the total unread count change in the current table view
            updateFolderCounts(
                totalUnreadCountChange,
                0 /* totalCount */,
                tableView.tableQuery.folderId,
                true /* isDeltaChange */
            );
        }
    }
);

/**
 * Calculate the delta value of the unread count after mark as read/unread action
 * @param tableConversationRelation the table conversation relation
 * @param shouldMarkAsRead whether the action is mark as read action
 */
function calculateUnreadCountChange(
    tableConversationRelation: TableViewConversationRelation,
    shouldMarkAsRead: boolean
): number {
    const currentUnreadCount = tableConversationRelation.unreadCount;
    return shouldMarkAsRead
        ? -1 * currentUnreadCount
        : tableConversationRelation.itemIds.length - currentUnreadCount;
}

/**
 * Updates the read status of the target rowKey in other tables that belong
 * to the same folder.
 */
function updateAdditionalTables(rowKey: string, shouldMarkAsRead: boolean, tableView: TableView) {
    const additionalTableViews = getAllTableViewsContainingItemsForFolder(
        tableView.tableQuery.folderId,
        false /* shouldIncludeSearchTable */
    );

    additionalTableViews.forEach((additionalTableView: TableView) => {
        /**
         * Skip over target tableView since that tableConversationRelation
         * has already been updated.
         */
        if (additionalTableView.id === tableView.id) {
            return;
        }

        const additionalTableConversationRelation = getTableConversationRelation(
            rowKey,
            additionalTableView.id
        );

        /**
         * Update unread count in tableViewConversationRelation (for additional table)
         * if the rowKey appears in that table.
         */
        if (additionalTableConversationRelation) {
            const unreadCountChange = calculateUnreadCountChange(
                additionalTableConversationRelation,
                shouldMarkAsRead
            );
            additionalTableConversationRelation.unreadCount += unreadCountChange;
        }
    });
}
