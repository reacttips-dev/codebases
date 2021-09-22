import markConversationsReadInListViewStore from '../actions/markConversationsReadInListViewStore';
import markConversationsAsReadStoreUpdate from 'owa-mail-actions/lib/triage/markConversationsAsReadStoreUpdate';
import {
    listViewStore,
    getRowKeysFromRowIds,
    shouldRemoveRowOnMarkReadAction,
} from 'owa-mail-list-store';
import { createLazyOrchestrator } from 'owa-bundling';
import tombstoneOperations, { TombstoneReasonType } from 'owa-mail-list-tombstone';
import removeRowsFromListViewStore from 'owa-mail-actions/lib/triage/removeRowsFromListViewStore';

export default createLazyOrchestrator(
    markConversationsAsReadStoreUpdate,
    'clone_markConversationAsReadStoreUpdate',
    actionMessage => {
        const { conversationIds, tableViewId, isReadValue, isExplicit } = actionMessage;

        // Get all the rowKeys for the given conversation and update the unread count
        const tableView = listViewStore.tableViews.get(tableViewId);

        // As this orchestrator is lazy loaded there are chances that the tableView is
        // already removed from the store before this orchestrator loads and tries to
        // perform local update. This can happen if we perform search for e.g and click
        // on a folder when the mark read setting is onSelectionChange.
        // The mark read shall be triggered after the search is exited and the selection
        // changes and during the async load of this orchestrator the search table has been
        // cleared. Note that the issue will not happen if the orchestrator was already loaded.
        if (!tableView) {
            return;
        }

        const rowKeys = getRowKeysFromRowIds(conversationIds, tableView);

        // 1. Make instant update to the read state and unread count
        markConversationsReadInListViewStore(
            rowKeys,
            isReadValue,
            tableView,
            true /* updateFolderCounts */
        );

        if (shouldRemoveRowOnMarkReadAction(tableView, isReadValue, isExplicit)) {
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
