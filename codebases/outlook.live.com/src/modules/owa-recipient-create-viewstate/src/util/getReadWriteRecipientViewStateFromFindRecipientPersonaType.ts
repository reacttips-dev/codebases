import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import { getPartialReadWriteRecipientViewStateFromEmailAddress } from './getPartialReadWriteRecipientViewStateFromEmailAddress';

/**
 * Maps FindRecipientPersonaType to ReadWriteRecipientViewState
 */
export function getReadWriteRecipientViewStateFromFindRecipientPersonaType(
    persona: FindRecipientPersonaType
): ReadWriteRecipientViewState {
    const partialViewState = getPartialReadWriteRecipientViewStateFromEmailAddress(
        persona.EmailAddress,
        persona.DisplayName
    );

    return {
        ...partialViewState,
        // inherit validity from the FindRecipientPersonaType
        // We have already resolved the persona from a find recipient, so we are
        // not pending resolution here.
        isPendingResolution: false,
        persona: persona,
    };
}

export default getReadWriteRecipientViewStateFromFindRecipientPersonaType;
