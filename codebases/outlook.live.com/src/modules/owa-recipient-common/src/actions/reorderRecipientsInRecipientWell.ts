import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type ReadWriteRecipientWellViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientWellViewState';
import { action, mutator } from 'satcheljs';

/**
 * Action for adding recipients in bulk
 * @param newRecipients New recipients to be added
 * @param recipientWell View state of recipient well
 */
const reorderRecipientsInRecipientWell = action(
    'reorderRecipientsInRecipientWell',
    (
        recipientWell: ReadWriteRecipientWellViewState,
        insertIndex: number,
        newRecipients: ReadWriteRecipientViewState[],
        indicesToRemove: number[]
    ) => ({
        recipientWell,
        insertIndex: insertIndex,
        newRecipients: newRecipients,
        indicesToRemove: indicesToRemove,
    })
);

export default reorderRecipientsInRecipientWell;

// Mutating recipientWell state
mutator(reorderRecipientsInRecipientWell, actionMessage => {
    const { recipientWell, insertIndex, newRecipients, indicesToRemove } = actionMessage;

    if (insertIndex > -1) {
        const currentItems: ReadWriteRecipientViewState[] = [...recipientWell.recipients];
        const updatedItems: ReadWriteRecipientViewState[] = [];

        for (let i = 0; i < currentItems.length; i++) {
            const item = currentItems[i];
            // If this is the insert before index, insert the dragged items, then the current item
            if (i === insertIndex) {
                newRecipients.forEach(draggedItem => {
                    updatedItems.push(draggedItem);
                });
            }
            if (!indicesToRemove.includes(i)) {
                // only insert items into the new list that are not being dragged
                updatedItems.push(item);
            }
        }
        // Insert items if we're inserting at the end
        if (insertIndex === currentItems.length) {
            newRecipients.forEach(draggedItem => {
                updatedItems.push(draggedItem);
            });
        }
        recipientWell.recipients = updatedItems;
        recipientWell.isDirty = true;
    }
});
