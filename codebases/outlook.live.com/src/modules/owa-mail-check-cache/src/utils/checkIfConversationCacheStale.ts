import listViewStore from 'owa-mail-list-store/lib/store/Store';
import mailStore from 'owa-mail-store/lib/store/Store';
import type Message from 'owa-service/lib/contract/Message';

export default function checkIfConversationCacheStale(conversationId: string): boolean {
    const conversationItem = listViewStore.conversationItems.get(conversationId);
    if (conversationItem) {
        const conversationCacheData = getConversationCacheData(conversationId);
        // Note: If a conversation contains more than 20 nodes, globalItemIds will always be greater than totalItemCount until load full conversation through loadMore button,
        // which means existing conversation cache will always be treated as stale cache before load the full conversaiton.
        return (
            conversationItem.globalItemIds.length != conversationCacheData.totalItemCount ||
            conversationItem.globalUnreadCount != conversationCacheData.unreadItemCount
        );
    }

    return false;
}

interface ConversationCacheData {
    totalItemCount: number;
    unreadItemCount: number;
}

function getConversationCacheData(conversationId: string): ConversationCacheData {
    const conversationCacheData = {
        unreadItemCount: 0,
        totalItemCount: 0,
    };
    const conversationItemPart = mailStore.conversations.get(conversationId);
    for (const conversationNodeId of conversationItemPart.conversationNodeIds) {
        const conversationNode = mailStore.conversationNodes.get(conversationNodeId);
        if (!conversationNode) {
            // If we encountered this issue, just break and return an invalid count so we re-fetch the conversation.
            conversationCacheData.totalItemCount = 0;
            break;
        }
        conversationCacheData.totalItemCount += conversationNode.itemIds.length;
        for (const itemId of conversationNode.itemIds) {
            const item = mailStore.items.get(itemId);
            if (!item) {
                // If we encountered this issue, just break and return an invalid count so we re-fetch the conversation.
                conversationCacheData.totalItemCount = 0;
                break;
            }
            conversationCacheData.unreadItemCount += (<Message>item).IsRead ? 0 : 1;
        }
    }
    return conversationCacheData;
}
