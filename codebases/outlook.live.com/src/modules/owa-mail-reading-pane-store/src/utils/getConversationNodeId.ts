import mailStore from 'owa-mail-store/lib/store/Store';

export default function getConversationNodeId(conversationId: string, itemId: string): string {
    if (mailStore.conversations.has(conversationId)) {
        const conversationItemParts = mailStore.conversations.get(conversationId);
        for (const conversationNodeId of conversationItemParts.conversationNodeIds) {
            const conversationNode = mailStore.conversationNodes.get(conversationNodeId);
            for (const id of conversationNode.itemIds) {
                if (id == itemId) {
                    return conversationNodeId;
                }
            }
        }
    }
    return null;
}
