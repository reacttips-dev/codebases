import type Message from 'owa-service/lib/contract/Message';

export default function isReplyToAll(message: Message): boolean {
    const toCount = message.ToRecipients ? message.ToRecipients.length : 0;
    const ccCount = message.CcRecipients ? message.CcRecipients.length : 0;

    if (toCount + ccCount == 1) {
        const singleRecipientMailboxType = toCount
            ? message.ToRecipients[0].MailboxType
            : message.CcRecipients[0].MailboxType;

        // If there's only one recipient, check the mailbox type to see if it's a group. If so, show "Reply all", otherwise show "Reply"
        return (
            singleRecipientMailboxType == 'PublicDL' ||
            singleRecipientMailboxType == 'PrivateDL' ||
            singleRecipientMailboxType == 'GroupMailbox' ||
            singleRecipientMailboxType == 'RecommendedGroup'
        );
    } else {
        // If recipient count is > 1, Show "Reply all".
        return true;
    }
}
