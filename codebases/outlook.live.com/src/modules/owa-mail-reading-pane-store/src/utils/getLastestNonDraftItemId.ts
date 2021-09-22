import mailStore from 'owa-mail-store/lib/store/Store';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';

export default function getLastestNonDraftItemId(conversationId: string): string {
    const conversationItemParts = mailStore.conversations.get(conversationId);
    const conversationNodeIds = conversationItemParts
        ? conversationItemParts.conversationNodeIds
        : [];
    const conversationNodeIdCount = conversationNodeIds.length;
    const conversationViewState = getConversationReadingPaneViewState(conversationId);
    if (conversationNodeIdCount == 0 || !conversationViewState) {
        return null;
    }

    const itemPartsMap = conversationViewState.itemPartsMap;
    let index = isNewestOnBottom() ? conversationNodeIdCount - 1 : 0;
    const indexIncrement = isNewestOnBottom() ? -1 : 1;
    while (index >= 0 && index < conversationNodeIdCount) {
        const itemPart = itemPartsMap.get(conversationNodeIds[index]);
        const item = itemPart ? mailStore.items.get(itemPart.itemId) : null;
        if (item && !item.IsDraft && !itemPart.isInRollUp) {
            return item.ItemId.Id;
        }
        index += indexIncrement;
    }

    return null;
}
