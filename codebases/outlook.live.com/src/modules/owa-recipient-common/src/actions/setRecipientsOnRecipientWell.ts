import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import { action, mutator } from 'satcheljs';

/**
 * Action for resetting the recipients on the well.
 * @param newRecipients New recipients to be added
 * @param recipientWellRecipients View state of recipient well
 */
const setRecipientsOnRecipientWell = action(
    'setRecipientsOnRecipientWell',
    (
        newRecipients: ReadWriteRecipientViewState[],
        recipientWell: RecipientWellWithFindControlViewState
    ) => ({
        newRecipients: newRecipients,
        recipientWell: recipientWell,
    })
);

export default setRecipientsOnRecipientWell;

// Mutating the recipient well state
mutator(setRecipientsOnRecipientWell, actionMessage => {
    const { recipientWell, newRecipients } = actionMessage;

    recipientWell.recipients = newRecipients;
    recipientWell.isDirty = true;
});
