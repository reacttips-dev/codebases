import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import { getStore } from '../store/Store';
import getActiveTabId from './getActiveTabId';

export default function getConversationReadingPaneViewState(
    conversationId?: string
): ConversationReadingPaneViewState {
    return getStore().loadedConversationReadingPaneViewStates.get(
        conversationId || getCurrentRenderedConversationId()
    );
}

function getCurrentRenderedConversationId(): string {
    // If SxS is displayed, this should be considered the current rendered conversation
    // Otherwise go with the active tab id
    return getStore().sxsItemId || getActiveTabId();
}
