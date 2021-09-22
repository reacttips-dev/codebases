import { action } from 'satcheljs';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
const removeRecipientsFromRecipientWells = action(
    'removeRecipientsFromRecipientWells',
    (
        emailAddresses: EmailAddressWrapper[],
        recipientWells: RecipientWellWithFindControlViewState[]
    ) => ({
        emailAddresses,
        recipientWells,
    })
);
export default removeRecipientsFromRecipientWells;
