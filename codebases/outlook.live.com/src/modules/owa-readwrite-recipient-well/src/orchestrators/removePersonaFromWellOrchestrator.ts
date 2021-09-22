import { orchestrator } from 'satcheljs';
import removePersonaFromWell from '../actions/removePersonaFromWell';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import compareFindRecipientPersonaType from 'owa-recipient-common/lib/utils/compareFindRecipientPersonaType';
import removeReadWriteRecipients from '../actions/removeReadWriteRecipients';

const removePersonaFromWellOrchestrator = orchestrator(removePersonaFromWell, actionMessage => {
    const { targetRecipientWell, personaToRemove, shouldRemoveAllOccurrences } = actionMessage;
    let elementsToRemove = targetRecipientWell.recipients.filter(
        (value: ReadWriteRecipientViewState) => {
            return compareFindRecipientPersonaType(value.persona, personaToRemove);
        }
    );
    if (elementsToRemove && elementsToRemove.length > 0) {
        const removeTillIndex: number = shouldRemoveAllOccurrences
            ? elementsToRemove.length - 1
            : 0;
        const recipientsToRemove = [];
        for (let index = 0; index <= removeTillIndex; index++) {
            if (!elementsToRemove[index] || elementsToRemove[index].blockWellItemRemoval) {
                continue;
            }
            recipientsToRemove.push(elementsToRemove[index]);
        }

        if (recipientsToRemove.length > 0) {
            removeReadWriteRecipients(targetRecipientWell, recipientsToRemove);
        }
    }
});

export default removePersonaFromWellOrchestrator;
export type { default as FindRecipientPersonaType } from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
export type { default as RecipientWellWithFindControlViewState } from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
