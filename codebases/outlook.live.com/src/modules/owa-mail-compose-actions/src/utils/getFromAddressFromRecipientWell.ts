import type ReadWriteRecipientWellViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientWellViewState';
import getCurrentComposeViewState from './findComposeFromRecipientWell';
import createFromRecipientWell from './createFromRecipientWell';

/**
 * Gets current sender address
 * @param {ReadWriteRecipientWellViewState} recipientWell passed by the addRecipientToRecipientWell action whenever a new recipient is added.
 * @returns string containing the from email address
 */
export default function getFromAddressFromRecipientWell(
    recipientWell: ReadWriteRecipientWellViewState
): string {
    const viewState = getCurrentComposeViewState(recipientWell);

    // If there is valid viewstate get current selected from address
    if (viewState?.fromViewState?.from?.email) {
        return viewState.fromViewState.from.email.EmailAddress;
    } else {
        // If there is no viewstate get from address from session
        return createFromRecipientWell().email.EmailAddress;
    }
}
