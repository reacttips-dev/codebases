import mailStore from '../store/Store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

// We validate conversationCache on loadConversationReadingPane
export default function isValidConversationCache(conversationId: string): boolean {
    const cachedConversation = mailStore.conversations.get(conversationId);
    if (cachedConversation) {
        const conversationSortOrderFromOptions = getUserConfiguration().UserOptions
            .ConversationSortOrderReact;
        // We don't judge if cache is valid or not based on conversationToLoad.loadingState.isLoading,
        // because even if loading in progress, conversationToLoad still could be a valid cache.
        return (
            cachedConversation.conversationNodeIds.length > 0 &&
            !cachedConversation.loadingState.hasLoadFailed &&
            cachedConversation.conversationSortOrder == conversationSortOrderFromOptions
        );
    }

    return false;
}
