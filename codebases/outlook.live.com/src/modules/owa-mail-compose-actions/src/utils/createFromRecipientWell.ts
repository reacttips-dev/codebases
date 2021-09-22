import type ReadOnlyRecipientViewState from 'owa-recipient-types/lib/types/ReadOnlyRecipientViewState';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type ItemId from 'owa-service/lib/contract/ItemId';
import getFromAddressWrapper from './fromAddressUtils/getFromAddressWrapper';

export default function createFromRecipientWell(
    fromAddress?: EmailAddressWrapper,
    referenceItemId?: ItemId
): ReadOnlyRecipientViewState {
    return { email: fromAddress ? fromAddress : getFromAddressWrapper(referenceItemId) };
}
