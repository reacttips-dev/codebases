import listViewStore from 'owa-mail-list-store/lib/store/Store';
import getLastestNonDraftItemId from './getLastestNonDraftItemId';
import loadConversationReadingPane from '../actions/loadConversationReadingPane';
import type { ClientItemId } from 'owa-client-ids';

async function getLatestNonDraftItemIdFromConversation(
    conversationId: ClientItemId
): Promise<ClientItemId> {
    // If we can't getLatestNonDraftItemId at first, try loadConversationReadingPane then getLatestNonDraftItemId
    if (!getLastestNonDraftItemId(conversationId.Id)) {
        const conversation = listViewStore.conversationItems.get(conversationId.Id);
        if (conversation) {
            await loadConversationReadingPane(
                conversationId,
                null /* instrumentationContext */,
                conversation.subject
            );
        }
    }

    const latestNonDraftItemId: string = getLastestNonDraftItemId(conversationId.Id);
    return {
        mailboxInfo: conversationId.mailboxInfo,
        Id: latestNonDraftItemId,
    };
}

export default getLatestNonDraftItemIdFromConversation;
