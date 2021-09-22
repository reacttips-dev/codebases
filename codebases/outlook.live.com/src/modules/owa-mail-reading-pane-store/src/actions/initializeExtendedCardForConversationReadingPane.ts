import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';
import type ItemPartViewState from '../store/schema/ItemPartViewState';
import { action } from 'satcheljs';

export default action(
    'initializeExtendedCardForConversationReadingPane',
    (
        conversationViewState: ConversationReadingPaneViewState,
        loadedItemParts: ItemPartViewState[]
    ) => ({
        conversationViewState: conversationViewState,
        loadedItemParts: loadedItemParts,
    })
);
