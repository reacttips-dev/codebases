import { isUnicodeWhitespaceLikeStringOrUndefined } from 'owa-unicode-utils/lib/isUnicodeWhitespaceLikeStringOrUndefined';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import getEmailWithRoutingType from './getEmailWithRoutingType';
import shouldDisplayFullEmailAddress from './shouldDisplayFullEmailAddress';

/**
 * Gets the string we should display for an email address.
 *
 * Always use this when displaying an address, since we don't know if we can trust the
 * Name field on the email address. (e.g. the Name field might be formatted as an SMTP
 * as part of a phishing attack)
 */
export function getDisplayTextFromEmailAddress(
    emailAddress: EmailAddressWrapper,
    explicitDisplayName?: string
): string {
    const requestedName = explicitDisplayName || emailAddress.Name;
    const nameIsUndefinedOrWhitespace = isUnicodeWhitespaceLikeStringOrUndefined(requestedName);
    return shouldDisplayFullEmailAddress(emailAddress, explicitDisplayName)
        ? !nameIsUndefinedOrWhitespace
            ? `${requestedName} <${getEmailWithRoutingType(emailAddress)}>`
            : getEmailWithRoutingType(emailAddress)
        : requestedName;
}

export default getDisplayTextFromEmailAddress;
