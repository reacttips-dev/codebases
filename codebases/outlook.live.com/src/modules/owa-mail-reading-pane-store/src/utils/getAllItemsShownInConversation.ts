import getAllItemPartsShownInConversation from './getAllItemPartsShownInConversation';
import type { ClientItem } from 'owa-mail-store';
import mailStore from 'owa-mail-store/lib/store/Store';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';

export default function getAllItemsShownInConversation(
    conversationViewState: ConversationReadingPaneViewState,
    getNewestItemFirst: boolean
): ClientItem[] {
    let itemParts = getAllItemPartsShownInConversation(conversationViewState, getNewestItemFirst);
    if (!itemParts) {
        return null;
    }

    let itemIds = itemParts.map(itemPart => (itemPart ? itemPart.itemId : null));

    return itemIds.map(itemId => mailStore.items.get(itemId)).filter(item => item != null);
}
