import addRecipientsToRecipientWell from 'owa-recipient-common/lib/actions/addRecipientsToRecipientWell';
import getRecipientsFromRecipientWells from 'owa-recipient-common/lib/utils/getRecipientsFromRecipientWells';
import { getReadWriteRecipientViewStateFromRecipientAddressString } from 'owa-recipient-create-viewstate/lib/util/getReadWriteRecipientViewStateFromRecipientAddressString';
import type { ComposeViewState } from 'owa-mail-compose-store';
import canModifyRecipients from './canModifyRecipients';

export function tryAddRecipientFromEmailAddressString(
    viewState: ComposeViewState,
    emailAddress: string,
    addToCC: boolean = false
) {
    const recipients = getRecipientsFromRecipientWells([
        viewState.toRecipientWell,
        viewState.ccRecipientWell,
        viewState.bccRecipientWell,
    ]);
    const recipientPresent = recipients.some(recipient => {
        return recipient.persona.EmailAddress.EmailAddress === emailAddress;
    });
    if (canModifyRecipients(viewState) && !recipientPresent) {
        const targetWell = addToCC ? viewState.ccRecipientWell : viewState.toRecipientWell;
        addRecipientsToRecipientWell(
            [getReadWriteRecipientViewStateFromRecipientAddressString(emailAddress)],
            targetWell
        );
    }
}
