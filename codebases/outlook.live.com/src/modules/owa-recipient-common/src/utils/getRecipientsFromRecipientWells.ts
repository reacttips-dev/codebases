import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

const getRecipientsFromRecipientWells = (
    recipientWells: RecipientWellWithFindControlViewState[]
): ReadWriteRecipientViewState[] => {
    if (!recipientWells || recipientWells.length === 0) {
        return [];
    }

    return recipientWells
        .filter(recipientWell => !!recipientWell)
        .reduce((acc, recipeintWell) => [...acc, ...getRecipients(recipeintWell)], []);
};

function getRecipients(recipientWell: RecipientWellWithFindControlViewState) {
    /**
     * recipients.slice() is required since recipients is a mobx observable array
     * and in order to get javascript array we need to use splice
     */
    return recipientWell?.recipients ? recipientWell.recipients.slice() : [];
}

export default getRecipientsFromRecipientWells;
