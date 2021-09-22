import type FocusedItemPart from '../store/schema/FocusedItemPart';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('setFocusedItemPart')(function setFocusedItemPart(
    focusedItemPart: FocusedItemPart,
    conversationId?: string
) {
    const conversationReadingPaneViewState = getConversationReadingPaneViewState();
    // This action might be invoked in a callback function,
    // if a different conversation has been loaded before this action is called, skip.
    if (conversationReadingPaneViewState.conversationId.Id != conversationId) {
        return;
    }
    conversationReadingPaneViewState.focusedItemPart = focusedItemPart;
});
