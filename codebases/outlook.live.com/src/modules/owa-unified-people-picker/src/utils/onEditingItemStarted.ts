import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import updateIsEditing from 'owa-readwrite-recipient-well/lib/actions/updateIsEditing';
import updateQueryStringAndFindRecipientSuggestions from './updateQueryStringAndFindRecipientSuggestions';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';

const onEditingItemStarted = (
    item: ReadWriteRecipientViewState,
    index: number,
    recipientWell: RecipientWellWithFindControlViewState,
    scenario?: string
) => {
    updateQueryStringAndFindRecipientSuggestions(recipientWell, item.displayText || '', scenario);
    const recipientViewState = recipientWell.recipients[index];
    updateIsEditing(recipientViewState, true);
};

export default onEditingItemStarted;
