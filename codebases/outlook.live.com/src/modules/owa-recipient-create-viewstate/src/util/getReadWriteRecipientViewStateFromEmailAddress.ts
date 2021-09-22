import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import { getPartialReadWriteRecipientViewStateFromEmailAddress } from './getPartialReadWriteRecipientViewStateFromEmailAddress';
import { getPersonaFromCacheByEmailAddress } from './getPersonaFromCacheByEmailAddress';

/**
 * Maps EmailAddress to ReadWriteRecipientViewState
 *
 * sets isPendingResolution true because we don't have a full persona object,
 * and may have to fetch the persona from the backend.
 */
export function getReadWriteRecipientViewStateFromEmailAddress(
    emailAddress: EmailAddressWrapper
): ReadWriteRecipientViewState {
    const personaFromCache = getPersonaFromCacheByEmailAddress(emailAddress);
    if (personaFromCache) {
        return personaFromCache;
    }
    const partialViewState = getPartialReadWriteRecipientViewStateFromEmailAddress(emailAddress);

    return {
        ...partialViewState,
        isPendingResolution: true,
        persona: {
            EmailAddress: emailAddress,
            PersonaId: emailAddress.ItemId,
        },
    };
}
