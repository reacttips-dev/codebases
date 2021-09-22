import { getUserMailboxInfo } from 'owa-client-ids';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type ReadWriteRecipientWellViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientWellViewState';
import getEmailWithRoutingType from 'owa-recipient-email-address/lib/utils/getEmailWithRoutingType';
import { lazySearchSuggestionsForSinglePersona } from 'owa-recipient-suggestions';
import resolvePendingPersonaOnRecipient from './resolvePendingPersonaOnRecipient';
import { action, mutator, orchestrator } from 'satcheljs';

/**
 * Action for adding recipients in bulk
 * @param newRecipients New recipients to be added
 * @param recipientWell View state of recipient well
 */
const addRecipientsToRecipientWell = action(
    'addRecipientsToRecipientWell',
    (
        newRecipients: ReadWriteRecipientViewState[],
        recipientWell: ReadWriteRecipientWellViewState
    ) => ({
        newRecipients: newRecipients,
        recipientWell,
    })
);

export default addRecipientsToRecipientWell;

// Mutating recipientWell state
mutator(addRecipientsToRecipientWell, actionMessage => {
    const { recipientWell } = actionMessage;

    recipientWell.recipients.splice(
        recipientWell.recipients.length,
        0,
        ...actionMessage.newRecipients
    );
    recipientWell.isDirty = true;
});

// async fetching recipients for new pending recipients
orchestrator(addRecipientsToRecipientWell, actionMessage => {
    const { newRecipients, recipientWell } = actionMessage;
    newRecipients.forEach(async newRecipient => {
        if (!newRecipient.isPendingResolution) {
            // do nothing for recipients that are not pending.
            return;
        }
        // search by their email address w/ routing type
        const emailWithRouting = getEmailWithRoutingType(newRecipient.persona.EmailAddress);

        let userIdentity = (recipientWell as RecipientWellWithFindControlViewState).userIdentity;

        if (!userIdentity) {
            userIdentity = getUserMailboxInfo().userIdentity;
        }

        const singlePersona = await lazySearchSuggestionsForSinglePersona
            .import()
            .then(searchSuggestionsForSinglePersona =>
                searchSuggestionsForSinglePersona(userIdentity, emailWithRouting)
            );
        resolvePendingPersonaOnRecipient(newRecipient, singlePersona, emailWithRouting);
    });
});
