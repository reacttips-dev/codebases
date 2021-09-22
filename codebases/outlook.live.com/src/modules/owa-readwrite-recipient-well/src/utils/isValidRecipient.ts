import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import isValidRecipientAddress from 'owa-recipient-email-address/lib/utils/isValidRecipientAddress';

export default function isValidRecipient(email: EmailAddressWrapper): boolean {
    return (
        isValidRecipientAddress(email.EmailAddress) ||
        (email.ItemId && email.MailboxType == 'PrivateDL')
    );
}
