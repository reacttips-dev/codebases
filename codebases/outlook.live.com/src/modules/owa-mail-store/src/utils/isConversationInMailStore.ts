import mailStore from '../store/Store';

/**
 * Helper function to check if mailstore contains conversation and nodes
 */
export default function isConversationInMailStore(conversationId: string): boolean {
    const conversationNodeIds: string[] | undefined = mailStore.conversations?.get(conversationId)
        ?.conversationNodeIds;
    const conversationNodeIdCount = conversationNodeIds?.length;
    return conversationNodeIdCount > 0;
}
