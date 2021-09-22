import mailStore from '../store/Store';
import type ConversationItemParts from '../store/schema/ConversationItemParts';

export default function canConversationLoadMore(conversationId: string): boolean {
    const conversationItemParts: ConversationItemParts = mailStore.conversations.get(
        conversationId
    );
    return conversationItemParts?.canLoadMore;
}
