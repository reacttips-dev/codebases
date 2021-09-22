import { releaseLoadedItemViewState } from '../mutators/loadedItemViewStateMutators';
import type ReadingPaneStore from '../store/schema/ReadingPaneStore';
import readingPaneStore from '../store/Store';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import getItemReadingPaneViewState from '../utils/getItemReadingPaneViewState';
import type { ObservableMap } from 'mobx';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import mailStore from 'owa-mail-store/lib/store/Store';
import type Item from 'owa-service/lib/contract/Item';
import { action } from 'satcheljs/lib/legacy';

export interface SetShouldShowEmptyReadingPaneState {
    readingPaneStore: ReadingPaneStore;
    conversations: ObservableMap<string, ConversationItemParts>;
    items: ObservableMap<string, Item>;
}

export default action('setShouldShowEmptyReadingPane')(function setShouldShowEmptyReadingPane(
    conversationId: string,
    itemIdBeingDeleted: string,
    state: SetShouldShowEmptyReadingPaneState = {
        readingPaneStore: readingPaneStore,
        conversations: mailStore.conversations,
        items: mailStore.items,
    }
) {
    const conversation = state.conversations.get(conversationId);
    const itemReadingPaneViewState = getItemReadingPaneViewState();
    const conversationReadingPaneViewState = getConversationReadingPaneViewState();
    if (
        (itemReadingPaneViewState && itemReadingPaneViewState.itemId == itemIdBeingDeleted) ||
        (!conversation &&
            conversationReadingPaneViewState &&
            conversationReadingPaneViewState.conversationId.Id == conversationId)
    ) {
        state.readingPaneStore.shouldShowEmptyReadingPane = true;
        state.readingPaneStore.primaryReadingPaneTabId = null;
        // Clear out item reading pane state since the item it is showing will no longer exist
        releaseLoadedItemViewState(itemIdBeingDeleted);
    }
});
