import deleteItemsStoreUpdate from 'owa-mail-actions/lib/triage/deleteItemsStoreUpdate';
import type { ClientItem } from 'owa-mail-store';
import deleteItemService from 'owa-mail-store/lib/services/deleteItemService';
import { deleteMeetingMessage } from 'owa-meeting-message';
import { orchestrator } from 'satcheljs';

export const deleteMeetingMessageOrchestrator = orchestrator(
    deleteMeetingMessage,
    actionMessage => {
        const { item, issueDeleteItemCall } = actionMessage;
        const itemContext = {
            itemId: item.ItemId.Id,
            itemConversationId: item.ConversationId,
            isRead: true,
            mailboxInfo: (item as ClientItem).MailboxInfo,
        };

        // Dispatch action to update the store state on the client
        // However, make the change on the client side only, unless issueDeleteItemCall is true;
        //  the server will delete the item as part of a successful respondToMeetingMessage request,
        //  so we shouldn't send a duplicate deleteItem request
        deleteItemsStoreUpdate([itemContext], item.ParentFolderId.Id, 'Delete');

        if (issueDeleteItemCall) {
            deleteItemService([item.ItemId], 'SoftDelete');
        }
    }
);
