import markConversationsReadInReadingPaneStore from '../actions/markConversationsReadInReadingPaneStore';
import markItemReadInReadingPaneStore from '../actions/markItemReadInReadingPaneStore';
import { createLazyOrchestrator } from 'owa-bundling';
import markAllAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markAllAsReadStoreUpdate';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import { getStore } from 'owa-mail-store/lib/store/Store';
import type Item from 'owa-service/lib/contract/Item';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

export const markAllAsReadOrchestrator = createLazyOrchestrator(
    markAllAsReadStoreUpdate,
    'markAllAsReadOrchestratorClone',
    actionMessage => {
        const { tableView, markAsRead, rowIdsToExclude } = actionMessage;

        // Table may not exist if user is clicking on context menu option for an unselected folder
        if (!tableView) {
            return;
        }

        const mailStore = getStore();

        switch (tableView.tableQuery.listViewType) {
            case ReactListViewType.Conversation:
                mailStore.conversations.forEach(
                    (value: ConversationItemParts, conversationId: string) => {
                        if (shouldUpdateStoreDataUponMarkAllRead(conversationId, rowIdsToExclude)) {
                            markConversationsReadInReadingPaneStore(
                                [conversationId],
                                markAsRead,
                                tableView.serverFolderId
                            );
                        }
                    }
                );
                break;

            case ReactListViewType.Message:
                mailStore.items.forEach((value: Item, itemId: string) => {
                    if (shouldUpdateStoreDataUponMarkAllRead(itemId, rowIdsToExclude)) {
                        markItemReadInReadingPaneStore(itemId, markAsRead);
                    }
                });
                break;
        }
    }
);

function shouldUpdateStoreDataUponMarkAllRead(rowId: string, rowIdsToExclude: string[]) {
    // We should update the current store data when there is no rows to exclude, or the current rowId is not
    // in the exclusion list
    return rowIdsToExclude == undefined || rowIdsToExclude.indexOf(rowId) == -1;
}
