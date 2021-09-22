import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import getDisplayNameAndAddressFromRecipientString from 'owa-recipient-email-address/lib/utils/getDisplayNameAndAddressFromRecipientString';
import parseOneOffEmailAddressFromString from 'owa-recipient-email-address/lib/utils/parseOneOffEmailAddressFromString';
import dangerousCreateSMTPEmailAddressWithoutValidation from 'owa-recipient-email-address/lib/utils/dangerousCreateSMTPEmailAddressWithoutValidation';
import {
    getPartialReadWriteRecipientViewStateFromEmailAddress,
    baseViewState,
} from './getPartialReadWriteRecipientViewStateFromEmailAddress';
import { getPersonaFromCacheByEmailAddress } from './getPersonaFromCacheByEmailAddress';

/**
 * Creates a pending OneOff recipient from the passed in address string.
 *
 * @param recipientAddressString the string to parse a recipient from.
 */
export function getReadWriteRecipientViewStateFromRecipientAddressString(
    recipientAddressString: string
): ReadWriteRecipientViewState {
    const nameAndAddress = getDisplayNameAndAddressFromRecipientString(recipientAddressString);
    const emailAddress = parseOneOffEmailAddressFromString(
        nameAndAddress.address,
        nameAndAddress.displayName
    );
    if (emailAddress === null) {
        return {
            ...baseViewState,
            // We failed to parse a display name and address. This is not a valid recipient.
            isValid: false,
            // This recipient hasn't been resolved yet.
            isPendingResolution: true,
            displayText: recipientAddressString,
            // Here we lie and say that the arbitrary string is an SMTP address
            // because the data model requires there be a parsed email address on the recipient.
            // TODO (#56102) Should we be lying here?
            // TODO (#56102) Remove this lie and introduce an 'invalid persona' type once
            // our SMTP validation is fully spec-compliant.
            persona: {
                EmailAddress: dangerousCreateSMTPEmailAddressWithoutValidation(
                    recipientAddressString
                ),
            },
        };
    }

    const personaFromCache = getPersonaFromCacheByEmailAddress(emailAddress);
    if (personaFromCache) {
        return personaFromCache;
    }

    const partialViewState = getPartialReadWriteRecipientViewStateFromEmailAddress(emailAddress);
    return {
        ...partialViewState,
        // This recipient hasn't been resolved yet.
        isPendingResolution: true,
        persona: {
            EmailAddress: emailAddress,
        },
    };
}
