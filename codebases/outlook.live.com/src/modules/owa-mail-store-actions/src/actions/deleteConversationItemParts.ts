import { mailStore } from 'owa-mail-store';
import tryRemoveFromMailStoreItems, {
    RemoveItemSource,
} from 'owa-mail-actions/lib/triage/tryRemoveFromMailStoreItems';
import { onDeleteConversationItemPartsComplete } from 'owa-mail-actions/lib/mailTriageActions';
import { mutatorAction } from 'satcheljs';

export default function deleteConversationItemParts(conversationId: string) {
    if (mailStore.conversations.has(conversationId)) {
        const conversationItemParts = mailStore.conversations.get(conversationId);
        for (const conversationNodeId of conversationItemParts.conversationNodeIds) {
            const conversationNode = mailStore.conversationNodes.get(conversationNodeId);
            if (conversationNode) {
                for (const itemId of conversationNode.itemIds) {
                    tryRemoveFromMailStoreItems(itemId, RemoveItemSource.ConversationItemParts);
                }
            }
            deleteConversationNode(conversationNodeId);
        }

        deleteConversation(conversationId);
    }

    onDeleteConversationItemPartsComplete();
}

const deleteConversationNode = mutatorAction(
    'deleteConversationNode',
    (conversationNodeId: string) => {
        mailStore.conversationNodes.delete(conversationNodeId);
    }
);

const deleteConversation = mutatorAction('deleteConversation', (conversationId: string) => {
    mailStore.conversations.delete(conversationId);
});
