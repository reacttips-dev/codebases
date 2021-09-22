import { isUnicodeWhitespaceLikeStringOrUndefined } from 'owa-unicode-utils/lib/isUnicodeWhitespaceLikeStringOrUndefined';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import isSameStringIgnoreCase from './isSameStringIgnoreCase';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

/**
 * Checks whether or not we should be displaying the full email address of the user.
 * (e.g. "Satya Nadella <snadella@contoso.com>" rather than just "Satya Nadella")
 *
 * @param emailAddress the EmailAddressWrapper to check
 * @param explicitDisplayName an override for EmailAddress.name
 */
const shouldDisplayFullEmailAddress = (
    emailAddress: EmailAddressWrapper,
    explicitDisplayName?: string
): boolean => {
    const requestedDisplayName = explicitDisplayName || emailAddress.Name;
    if (!requestedDisplayName) {
        return true;
    }

    const nameIsWhitespace = isUnicodeWhitespaceLikeStringOrUndefined(requestedDisplayName);
    const nameIsSameAsDisplayString = isSameStringIgnoreCase(
        requestedDisplayName,
        emailAddress.EmailAddress
    );
    const nameLooksLikeSmtpAddress = requestedDisplayName.indexOf('@') !== -1;
    const isEnterpriseAndExternalMailboxType =
        !isConsumer() &&
        (emailAddress.MailboxType === 'ExternalMailbox' || emailAddress.MailboxType === 'LinkedIn');
    const isOneOffOrUnknownMailboxType =
        emailAddress.MailboxType === 'OneOff' || emailAddress.MailboxType === 'Unknown';

    return (
        // Some distribution type (e.g. MAPIPDL) have no EmailAddress, so we can
        // only display them with their display name.
        emailAddress.EmailAddress &&
        // if the display name is suspicious (e.g. empty) or not present,
        // show the email address as well.
        !(emailAddress.RoutingType === 'SMTP' && nameIsSameAsDisplayString) &&
        (nameIsWhitespace ||
            // Protection against someone lying about their address in their display name
            // Always show for external addresses in enterprise
            nameLooksLikeSmtpAddress ||
            isEnterpriseAndExternalMailboxType ||
            // OneOff mailboxes are just parsed from strings. We can't trust their display text.
            // If they are later resolved from the backend, the EmailAddress object will be updated,
            // and the displayText recalculated
            isOneOffOrUnknownMailboxType)
    );
};

export default shouldDisplayFullEmailAddress;
