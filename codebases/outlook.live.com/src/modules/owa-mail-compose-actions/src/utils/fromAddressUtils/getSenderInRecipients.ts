import getAllFromAddresses from './getAllFromAddresses';
import { isSameStringIgnoreCase } from '../isSelf';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

/**
 * Gets the address the email was sent to (when replying to an email)
 * Consumers can set the default address they send from, so this may be different
 * than the account name they used when initally creating the account
 *
 * Looks through all of the addresses a user can send from, and matches against
 * the To or Cc recipients of the email
 *
 * Returns the first address belonging to the sender that is found in the recipients,
 * or else null if no matching address is found
 *
 * @param toRecipients the To recipients of the message
 * @param ccRecipients the Cc recipients of the message
 */
export default function getSenderInRecipients(
    toRecipients: EmailAddressWrapper[],
    ccRecipients: EmailAddressWrapper[]
): string {
    let recipients = (toRecipients || []).concat(ccRecipients || []);
    return tryFindRecipient(
        recipients,
        getAllFromAddresses(true /* includeProxyAddressesForEnt */)
    );
}

function tryFindRecipient(recipients: EmailAddressWrapper[], addresses: string[]): string {
    for (let i = 0; i < addresses.length; i++) {
        if (isInRecipients(addresses[i], recipients)) {
            return addresses[i];
        }
    }
    return null;
}

function isInRecipients(emailAddress: string, recipients: EmailAddressWrapper[]): boolean {
    if (recipients && recipients.length > 0) {
        for (let recipient of recipients) {
            if (recipient && isSameStringIgnoreCase(emailAddress, recipient.EmailAddress)) {
                return true;
            }
        }
    }
    return false;
}
