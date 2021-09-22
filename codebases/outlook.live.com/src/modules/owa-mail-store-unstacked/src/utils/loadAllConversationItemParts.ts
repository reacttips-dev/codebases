import { lazyLoadConversation, MAX_ITEMS_ALLOWED_TO_RETRIEVE } from 'owa-mail-store-actions';
import { mailStore } from 'owa-mail-store';
import { ClientItemId, getUserMailboxInfo } from 'owa-client-ids';

export default async function loadAllConversationItemParts(conversationId: string): Promise<void> {
    let conversationItemParts = mailStore.conversations?.get(conversationId);

    // If the conversation is not yet loaded or there are more items on the server, load the conversation
    while (!conversationItemParts || conversationItemParts?.canLoadMoreForRelationMap) {
        if (conversationItemParts) {
            conversationItemParts.isLoadMoreInProgress = true;
            conversationItemParts.maxItemsToReturn = MAX_ITEMS_ALLOWED_TO_RETRIEVE;
            conversationItemParts.syncState = '';
        }

        await lazyLoadConversation.importAndExecute(
            { Id: conversationId, mailboxInfo: getUserMailboxInfo() } as ClientItemId,
            'CreateConversationRelationMap'
        );

        if (!conversationItemParts) {
            conversationItemParts = mailStore.conversations?.get(conversationId);

            // In case we have an error loading the conversation, break out of the loop
            if (!conversationItemParts) {
                break;
            }
        }
    }
}
