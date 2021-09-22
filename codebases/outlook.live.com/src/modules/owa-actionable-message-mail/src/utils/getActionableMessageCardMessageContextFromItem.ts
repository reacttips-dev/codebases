import type { MessageContext } from 'owa-actionable-message-v2';
import type { ClientItem } from 'owa-mail-store';
import type Message from 'owa-service/lib/contract/Message';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

export default function getActionableMessageCardMessageContextFromItem(
    item: ClientItem
): MessageContext {
    const message = item as Message;
    return {
        conversationId: message.ConversationId.Id,
        odataConversationId: ewsIdToODataId(message.ConversationId.Id),
        itemId: message.ItemId.Id,
        odataItemId: ewsIdToODataId(message.ItemId.Id),
        senderAddress: getSenderAddress(message),
        userId: getUserConfiguration().SessionSettings.UserPrincipalName,
        mailboxInfo: item.MailboxInfo,
        isGroupEscalationMessage: message.IsGroupEscalationMessage,
    };
}

function ewsIdToODataId(inputItemId: string): string {
    inputItemId = inputItemId.replace(/\//g, '-');
    inputItemId = inputItemId.replace(/\+/g, '_');
    inputItemId = inputItemId.replace(/\ /g, '_');
    return inputItemId;
}

function getSenderAddress(message: Message): string {
    return message.SenderSMTPAddress || message.Sender?.Mailbox?.EmailAddress;
}
