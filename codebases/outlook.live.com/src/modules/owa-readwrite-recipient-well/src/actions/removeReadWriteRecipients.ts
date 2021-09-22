import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import onRecipientsChanged from './onRecipientsChanged';
import removeRecipientFromRecipientWell from 'owa-recipient-common/lib/actions/removeRecipientFromRecipientWell';
import setCommonWellItemSelectedState from 'owa-readwrite-common-well/lib/actions/setCommonWellItemSelectedState';
import { action } from 'satcheljs/lib/legacy';

export default action('removeReadWriteRecipients')(function removeReadWriteRecipients(
    recipientWell: RecipientWellWithFindControlViewState,
    recipientsLocatorToRemove: (ReadWriteRecipientViewState | number)[],
    willTriggerRecipientsChangedEvent: boolean = true
) {
    let hasRemovedAnyRecipient = false;
    for (let recipientLocatorToRemove of recipientsLocatorToRemove) {
        let indexToRemove = -1;
        if (typeof recipientLocatorToRemove === 'number') {
            indexToRemove = recipientLocatorToRemove;
        } else {
            indexToRemove = recipientWell.recipients
                .map(function (emailAddressCheck: ReadWriteRecipientViewState) {
                    return emailAddressCheck.persona.EmailAddress;
                })
                .indexOf(recipientLocatorToRemove.persona.EmailAddress);
        }
        if (indexToRemove >= 0) {
            let recipientToRemove = recipientWell.recipients[indexToRemove];
            if (recipientToRemove.blockWellItemRemoval) {
                return;
            }

            removeRecipientFromRecipientWell(
                indexToRemove,
                recipientWell,
                onRemovedRecipientCallback
            );

            hasRemovedAnyRecipient = true;
        }
    }

    if (willTriggerRecipientsChangedEvent && hasRemovedAnyRecipient) {
        onRecipientsChanged(recipientWell);
    }
});

function onRemovedRecipientCallback(
    removedRecipient: ReadWriteRecipientViewState[],
    indexToRemove: number,
    recipientWell: RecipientWellWithFindControlViewState
) {
    if (removedRecipient[0].isSelected && recipientWell.recipients.length > 0) {
        setCommonWellItemSelectedState(
            recipientWell.recipients[Math.max(0, indexToRemove - 1)],
            true
        );
    }
}
