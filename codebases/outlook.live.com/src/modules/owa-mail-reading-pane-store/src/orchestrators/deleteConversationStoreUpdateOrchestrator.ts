import closeSecondaryReadingPaneTab from '../utils/closeSecondaryReadingPaneTab';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import { createLazyOrchestrator } from 'owa-bundling';
import deleteConversationStoreUpdate from 'owa-mail-actions/lib/triage/deleteConversationStoreUpdate';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import {
    deleteConversationItemParts,
    setIsPendingDeleteConversationItemParts,
} from 'owa-mail-store-actions';

/**
 * Handles the actual delete for a conversation.
 * @param conversationId - the conversation to delete
 */
function deleteConversationFromReadingPane(conversationId: string) {
    const conversationReadingPaneViewState = getConversationReadingPaneViewState();
    closeSecondaryReadingPaneTab(conversationId, null /*itemId*/);
    const composeViewState = findInlineComposeViewState(conversationId);

    // Don't need to update conversation reading pane state.
    // Listview will trigger selecting new item if selected item is being deleted.
    if (
        conversationReadingPaneViewState &&
        conversationReadingPaneViewState.conversationId.Id == conversationId &&
        composeViewState &&
        composeViewState.isInlineCompose
    ) {
        // If deleted conversation has inline compose open in RP, delay delete conversation item parts
        setIsPendingDeleteConversationItemParts(conversationId, true);
    } else {
        deleteConversationItemParts(conversationId);
    }
}

export const deleteConversationStoreUpdateOrchestrator = createLazyOrchestrator(
    deleteConversationStoreUpdate,
    'deleteConversationStoreUpdateClone',
    actionMessage => {
        const { conversationIds } = actionMessage;
        conversationIds.forEach(conversationId => {
            deleteConversationFromReadingPane(conversationId);
        });
    }
);
