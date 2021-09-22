import { ConversationItemParts, mailStore } from 'owa-mail-store';
import { action } from 'satcheljs/lib/legacy';

export interface SetIsPendingDeleteConversationItemPartsState {
    conversationItemParts: ConversationItemParts;
}

export default action('setIsPendingDeleteConversationItemParts')(
    function setIsPendingDeleteConversationItemParts(
        conversationId: string,
        isPendingDelete: boolean,
        state: SetIsPendingDeleteConversationItemPartsState = {
            conversationItemParts: mailStore.conversations.get(conversationId),
        }
    ) {
        const conversationItemParts = state.conversationItemParts;
        if (conversationItemParts) {
            conversationItemParts.isPendingDelete = isPendingDelete;
        }
    }
);
