import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import getEmailWithRoutingType from 'owa-recipient-email-address/lib/utils/getEmailWithRoutingType';
import getDisplayTextFromEmailAddress from 'owa-recipient-email-address/lib/utils/getDisplayTextFromEmailAddress';
import { action, mutator } from 'satcheljs';

export const resolvePendingPersonaOnRecipient = action(
    'resolvePendingPersonaOnRecipient',
    (
        recipient: ReadWriteRecipientViewState,
        nextPersona: FindRecipientPersonaType | null,
        searchedString: string
    ) => ({
        recipient,
        nextPersona,
        searchedString,
    })
);

mutator(resolvePendingPersonaOnRecipient, ({ recipient, nextPersona, searchedString }) => {
    const existingEmailWithRouting = getEmailWithRoutingType(recipient.persona.EmailAddress);
    if (existingEmailWithRouting !== searchedString) {
        // Someone else has updated the email address on the recipient. It's their
        // responsibility to ensure that they resolved it.
        return;
    }

    // Regardless of if we resolved to a single recipient successfully or not, this recipient is
    // no longer pending resolution
    recipient.isPendingResolution = false;

    if (nextPersona) {
        recipient.persona = nextPersona;
        // A recipient resolved from the backend must be valid.
        // This will only happen if we force-resolve a recipient that does not have
        // an name that looks like an address, but they resolve to a recipient on the backend.
        recipient.isValid = true;
        // Also update the displayText because that has a data dependency on the resolved
        // email address.
        recipient.displayText = getDisplayTextFromEmailAddress(nextPersona.EmailAddress);
    }
});

export default resolvePendingPersonaOnRecipient;
