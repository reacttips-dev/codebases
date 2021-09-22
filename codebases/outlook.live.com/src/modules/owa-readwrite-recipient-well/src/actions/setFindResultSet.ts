import { action } from 'satcheljs/lib/legacy';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';

export default action('setFindResultSet')(function setFindResultSet(
    viewstate: FindControlViewState,
    findResultSet: FindRecipientPersonaType[]
) {
    viewstate.findResultSet = findResultSet;
});
