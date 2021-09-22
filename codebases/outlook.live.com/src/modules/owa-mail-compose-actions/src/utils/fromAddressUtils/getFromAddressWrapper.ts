import getAlternativeFromAddress from './getAlternativeFromAddress';
import getSenderInRecipients from './getSenderInRecipients';
import { getStore } from 'owa-mail-store';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type ItemId from 'owa-service/lib/contract/ItemId';
import type Message from 'owa-service/lib/contract/Message';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';

/**
 * Get the from address that should be shown in the From well
 * @param referenceItemId, the id for referencing the message
 */
export default function getFromAddressWrapper(referenceItemId?: ItemId): EmailAddressWrapper {
    let fromAddress;
    if (referenceItemId) {
        const mailStore = getStore();
        const items = mailStore?.items;
        const referenceItem =
            items && items.has(referenceItemId.Id) && (items.get(referenceItemId.Id) as Message);
        fromAddress =
            referenceItem &&
            getSenderInRecipients(referenceItem.ToRecipients, referenceItem.CcRecipients);
    }

    return <EmailAddressWrapper>{
        MailboxType: 'Mailbox',
        RoutingType: 'SMTP',
        EmailAddress: fromAddress || getAlternativeFromAddress(),
        Name: getUserConfiguration().SessionSettings.UserDisplayName,
    };
}
