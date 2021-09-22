import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import isValidEmailAddress from './isValidEmailAddress';
import type Recipient from './Recipient';

export default function convertRecipientsToEmailAddressWrappers(
    recipients: Recipient[]
): EmailAddressWrapper[] {
    const emailAddressWrappers: EmailAddressWrapper[] = [];
    recipients.forEach(recipient => {
        if (isValidEmailAddress(recipient.address)) {
            emailAddressWrappers.push({ Name: recipient.name, EmailAddress: recipient.address });
        } // if email address is invalid, skip
    });
    return emailAddressWrappers;
}
