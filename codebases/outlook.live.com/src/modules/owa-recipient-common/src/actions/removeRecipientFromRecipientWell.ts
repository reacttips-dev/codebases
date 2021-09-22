import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type ReadWriteRecipientWellViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientWellViewState';
import { action, orchestrator, mutator } from 'satcheljs';

const removeRecipientFromRecipientWell = action(
    'removeRecipientFromRecipientWell',
    (
        recipientIndex: number,
        recipientWellRecipients: ReadWriteRecipientWellViewState,
        onRecipientDeletedCallback: (
            removedRecipients: ReadWriteRecipientViewState[],
            indexToRemove: number,
            recipientWellRecipients: ReadWriteRecipientWellViewState
        ) => void,
        newRecipients?: ReadWriteRecipientViewState[]
    ) => ({
        recipientIndex: recipientIndex,
        recipientWellRecipients: recipientWellRecipients,

        onRecipientDeletedCallback: onRecipientDeletedCallback,
        deletedRecipient: recipientWellRecipients.recipients[recipientIndex],
        newRecipients: newRecipients,
    })
);

mutator(removeRecipientFromRecipientWell, actionMessage => {
    actionMessage.recipientWellRecipients.isDirty = true;
    actionMessage.recipientWellRecipients.recipients.splice(
        actionMessage.recipientIndex,
        1,
        ...(actionMessage.newRecipients || [])
    );
});

orchestrator(removeRecipientFromRecipientWell, actionMessage => {
    actionMessage.onRecipientDeletedCallback(
        [actionMessage.deletedRecipient],
        actionMessage.recipientIndex,
        actionMessage.recipientWellRecipients
    );
});

export default removeRecipientFromRecipientWell;
