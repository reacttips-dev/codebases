import type ItemPartViewState from '../store/schema/ItemPartViewState';
import getConversationReadingPaneViewState from '../utils/getConversationReadingPaneViewState';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import { getStore as getMailStore } from 'owa-mail-store/lib/store/Store';
import type Message from 'owa-service/lib/contract/Message';

export default function getFirstItemInConversation(conversationId: string): Message {
    const mailStore = getMailStore();
    const itemPart = getFirstItemPartInConversation(conversationId);
    const itemId = itemPart ? itemPart.itemId : null;
    const item = mailStore.items.get(itemId) as Message;
    return item;
}

export function getFirstItemPartInConversation(conversationId: string): ItemPartViewState {
    const mailStore = getMailStore();
    const conversationItemParts = mailStore.conversations.get(conversationId);
    const conversationNodeIds = conversationItemParts?.conversationNodeIds;
    const conversationNodeIdCount = conversationNodeIds ? conversationNodeIds.length : 0;

    let itemPart: ItemPartViewState;

    if (conversationNodeIdCount > 0) {
        const conversationReadingPaneState = getConversationReadingPaneViewState(conversationId);
        const itemPartsMap = conversationReadingPaneState?.itemPartsMap;

        if (itemPartsMap) {
            const indexOfFirstItem = isNewestOnBottom() ? 0 : conversationNodeIdCount - 1;
            itemPart = itemPartsMap.get(conversationNodeIds[indexOfFirstItem]);
        }
    }
    return itemPart;
}
