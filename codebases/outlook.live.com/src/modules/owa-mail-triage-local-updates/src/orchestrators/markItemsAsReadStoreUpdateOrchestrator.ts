import markItemsReadInListViewStore from '../actions/markItemsReadInListViewStore';
import markItemsAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markItemsAsReadStoreUpdate';
import { createLazyOrchestrator } from 'owa-bundling';
import {
    listViewStore,
    getRowKeysFromRowIds,
    getTableConversationRelation,
    shouldRemoveRowOnMarkReadAction,
} from 'owa-mail-list-store';
import tombstoneOperations, { TombstoneReasonType } from 'owa-mail-list-tombstone';
import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { mailStore } from 'owa-mail-store';

export default createLazyOrchestrator(
    markItemsAsReadStoreUpdate,
    'clone_markItemsAsReadStoreUpdateOrchestrator',
    actionMessage => {
        const { itemIds, isReadValue, isExplicit, tableViewId } = actionMessage;
        const tableView = listViewStore.tableViews.get(tableViewId);

        // Tableview is null when OWA loads in fileshub.
        // and we do not want to make listview store updates when OWA is loaded in Fileshub
        if (!tableView) {
            return;
        }

        // 1. Make instant update to the read state and unread count
        markItemsReadInListViewStore(tableView, itemIds, isReadValue);

        var rowKeys = [];
        const shouldRemoveRowOnMarkAsRead = shouldRemoveRowOnMarkReadAction(
            tableView,
            isReadValue,
            isExplicit
        );
        if (tableView.tableQuery.listViewType == ReactListViewType.Message) {
            // If the table is in message view get rowKeys from itemIds
            rowKeys = getRowKeysFromRowIds(itemIds, tableView);
        } else {
            // If the table is in conversation view then get the rowKeys of
            // conversation rows to which these items belong
            itemIds.forEach(itemId => {
                const item = mailStore.items.get(itemId);
                if (item) {
                    const conversationId = item.ConversationId?.Id;
                    const rowKeys = getRowKeysFromRowIds([conversationId], tableView);
                    rowKeys.forEach(rowKey => {
                        // We make row remove instant update if in the current scenario the row has to be removed from view and the conversation is entirely read
                        // Else we only make the read state instant update.
                        const tableConversationRelation = getTableConversationRelation(
                            rowKey,
                            tableViewId
                        );
                        if (
                            !shouldRemoveRowOnMarkAsRead ||
                            tableConversationRelation.unreadCount == 0
                        ) {
                            rowKeys.push(rowKey);
                        }
                    });
                }
            });
        }

        // The mark read operation can be performed from RP item parts. It can happen that we do not have any row to update in LV as
        // RP was showing an item that is not in the current tableView. In which case we do not make any instant updates.
        if (rowKeys.length == 0) {
            return;
        }

        if (shouldRemoveRowOnMarkAsRead) {
            // 2. Add rowKeys for the rows that are to be removed to tombstone so they don't pop back in
            tombstoneOperations.add(rowKeys, tableView, TombstoneReasonType.RowRemove);

            // 3. Make an instant update to the view by removing the row
            removeRowsFromListViewStore(rowKeys, tableView, 'MarkAsRead');
        } else {
            // 2. Add rowKeys for the rows that are to be marked as read to tombstone
            // so that read state does not flicker upon incorrect/partial notifications
            tombstoneOperations.add(rowKeys, tableView, TombstoneReasonType.Read);
        }
    }
);
