import { action } from 'satcheljs/lib/legacy';
import FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';

export const updateRecipientWellFindResultSet = action('updateRecipientWellFindResultSet')(
    (recipientWell: FindControlViewState, findResultSet: FindRecipientPersonaType[]) => {
        recipientWell.findResultSet = findResultSet;
    }
);
