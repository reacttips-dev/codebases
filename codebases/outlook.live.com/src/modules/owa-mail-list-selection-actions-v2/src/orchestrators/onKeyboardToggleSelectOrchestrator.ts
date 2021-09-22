import * as mailListSelectionActionsV2 from 'owa-mail-actions/lib/mailListSelectionActions';
import { listViewStore } from 'owa-mail-list-store';
import { orchestrator } from 'satcheljs';
import { default as onKeyboardToggleSelect } from 'owa-mail-actions/lib/onKeyboardToggleSelect';

// Orchestrator to select the next row or item part on keyboard input
orchestrator(onKeyboardToggleSelect, actionMessage => {
    const { tableView, mailListItemSelectionSource } = actionMessage;

    const focusedNodeId = listViewStore.expandedConversationViewState.focusedNodeId;
    // If an item part is focused, toggle its selection.
    if (focusedNodeId) {
        mailListSelectionActionsV2.toggleSelectItemPart(focusedNodeId);
    } else {
        // Otherwise, toggle the selection of the focusedRowKey
        mailListSelectionActionsV2.toggleSelectRow(
            tableView,
            tableView.focusedRowKey,
            true /* isUserNavigation */,
            mailListItemSelectionSource
        );
    }
});
