import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import { orchestrator } from 'satcheljs';
import removeRecipientsFromRecipientWells from '../actions/removeRecipientsFromRecipientWells';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import removePersonaFromWell from '../actions/removePersonaFromWell';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';

/**
 * Orchestrator subscribed to removeRecipientsFromRecipientWells
 * which is responsible to remove given list of recipients from list of
 * given wells of type RecipientWellWithFindControlViewState
 */
const removeRecipientsFromRecipientWellsOrchestrator = orchestrator(
    removeRecipientsFromRecipientWells,
    actionMessage => {
        const recipientWells: RecipientWellWithFindControlViewState[] =
            actionMessage.recipientWells;

        if (!recipientWells || recipientWells.length === 0) {
            return;
        }

        const emailAddresses: EmailAddressWrapper[] = actionMessage.emailAddresses;

        emailAddresses.forEach(emailAddress => {
            const personaToRemove: FindRecipientPersonaType = {
                EmailAddress: emailAddress,
            };

            recipientWells
                .filter(recipientWell => !!recipientWell)
                .forEach(recipientWell =>
                    removePersonaFromWell(recipientWell, personaToRemove, true)
                );
        });
    }
);

export default removeRecipientsFromRecipientWellsOrchestrator;
