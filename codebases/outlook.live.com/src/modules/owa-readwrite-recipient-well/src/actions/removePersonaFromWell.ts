import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import { action } from 'satcheljs';

const removePersonaFromWell = action(
    'removePersonaFromWell',
    (
        targetRecipientWell: RecipientWellWithFindControlViewState,
        personaToRemove: FindRecipientPersonaType,
        shouldRemoveAllOccurrences: boolean = false
    ) => ({
        targetRecipientWell,
        personaToRemove,
        shouldRemoveAllOccurrences,
    })
);

export default removePersonaFromWell;
