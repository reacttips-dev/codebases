import mailStore from 'owa-mail-store/lib/store/Store';
import type ConversationReadingPaneViewState from '../store/schema/ConversationReadingPaneViewState';

export default function canConversationLoadMoreFromServer(
    conversationViewState: ConversationReadingPaneViewState
): boolean {
    if (!conversationViewState) {
        return false;
    }

    const conversationItemParts = mailStore.conversations.get(
        conversationViewState.conversationId.Id
    );
    return conversationItemParts?.canLoadMore;
}
