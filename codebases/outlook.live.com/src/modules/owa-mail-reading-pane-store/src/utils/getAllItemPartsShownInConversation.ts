import type ItemPartViewState from '../store/schema/ItemPartViewState';
import mailStore from 'owa-mail-store/lib/store/Store';
import { default as isNewestItemLast } from 'owa-mail-store/lib/utils/isNewestOnBottom';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';

export default function getAllItemPartsShownInConversation(
    conversationViewState: ConversationReadingPaneViewState,
    getNewestItemFirst: boolean
): ItemPartViewState[] {
    if (!conversationViewState) {
        return null;
    }

    const conversation = mailStore.conversations.get(conversationViewState.conversationId.Id);
    if (!conversation || !conversation.conversationNodeIds.length) {
        return null;
    }

    let itemParts = conversation.conversationNodeIds
        .map(nodeId => conversationViewState.itemPartsMap.get(nodeId))
        .filter(itemPart => itemPart != null);

    if (isNewestItemLast() == getNewestItemFirst) {
        // isNewestItemLast will tell us the current state of the last item in the collection from the store.
        // If the current state of the LAST item is equal to the requested state of the FIRST item, we need to reverse the collection.
        itemParts = itemParts.reverse();
    }

    return itemParts;
}
