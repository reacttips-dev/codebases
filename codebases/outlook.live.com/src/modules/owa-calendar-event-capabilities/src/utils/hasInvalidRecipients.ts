import type AttendeeType from 'owa-service/lib/contract/AttendeeType';
import isValidRecipient from 'owa-readwrite-recipient-well/lib/utils/isValidRecipient';

/**
 * Makes sure that all the recipients that are passed are valid
 */
export default function hasInvalidRecipients(recipients: AttendeeType[]): boolean {
    if (!recipients) {
        // No recipients mean there are no invalid recipients
        return false;
    }

    let hasInvalid: boolean = false;
    recipients.forEach(recipient => {
        if (!isValidRecipient(recipient.Mailbox)) {
            hasInvalid = true;
        }
    });

    return hasInvalid;
}
