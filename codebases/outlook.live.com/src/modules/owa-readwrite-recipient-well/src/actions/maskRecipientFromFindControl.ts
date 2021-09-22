import { maskAutoCompleteRecipient } from '../services/maskAutoCompleteRecipient';
import deleteFromCache from 'owa-recipient-cache/lib/selectors/deleteFromCache';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import type FindRecipientPersonaType from 'owa-recipient-types/lib/types/FindRecipientPersonaType';
import { action } from 'satcheljs/lib/legacy';

export default action('maskRecipientFromFindControl')(function maskRecipientFromFindControl(
    recipientWell: FindControlViewState,
    recipientToMask: FindRecipientPersonaType
) {
    // Remove Recipient from Find Control and Cache.
    recipientWell.findResultSet = recipientWell.findResultSet.filter(curObj => {
        return curObj.EmailAddress.EmailAddress !== recipientToMask.EmailAddress.EmailAddress;
    });
    deleteFromCache(recipientToMask.EmailAddress);

    // Mask Recipient Well
    maskAutoCompleteRecipient(recipientToMask.EmailAddress.EmailAddress);
});
