import type { MailboxInfo } from 'owa-client-ids';
import { action } from 'satcheljs';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type { ActionType } from './userMailInteractionAction';

export interface ItemContext {
    itemId: string;
    itemConversationId: ItemId;
    isRead: boolean;
    mailboxInfo: MailboxInfo;
}

/**
 * Action to propagate the delete items action to client stores
 * @param itemContexts - the contexts for items being deleted
 * @param parentFolderId - the parent FolderId
 * @param actionType - type of action that lead to the delete store update
 */
export default action(
    'DELETE_ITEMS_STORE_UPDATE',
    (itemContexts: ItemContext[], parentFolderId: string, actionType: ActionType) => {
        return {
            itemContexts,
            parentFolderId,
            actionType,
        };
    }
);
