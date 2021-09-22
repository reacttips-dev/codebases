import markConversationsReadInListViewStore from '../actions/markConversationsReadInListViewStore';
import markItemsReadInListViewStore from '../actions/markItemsReadInListViewStore';
import { createLazyOrchestrator } from 'owa-bundling';
import markAllAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markAllAsReadStoreUpdate';
import { getRowIdsFromRowKeys } from 'owa-mail-list-store';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';

export const markAllAsReadOrchestrator = createLazyOrchestrator(
    markAllAsReadStoreUpdate,
    'markAllAsReadOrchestratorClone',
    actionMessage => {
        const { tableView, markAsRead } = actionMessage;

        // Table may not exist if user is clicking on context menu option for an unselected folder
        if (!tableView) {
            return;
        }

        switch (tableView.tableQuery.listViewType) {
            case ReactListViewType.Conversation:
                markConversationsReadInListViewStore(
                    tableView.rowKeys,
                    markAsRead,
                    tableView,
                    false /* updateFolderCounts */
                );
                break;

            case ReactListViewType.Message:
                const itemIdStrings = getRowIdsFromRowKeys(tableView.rowKeys, tableView.id);
                markItemsReadInListViewStore(tableView, itemIdStrings, markAsRead);
                break;
        }
    }
);
