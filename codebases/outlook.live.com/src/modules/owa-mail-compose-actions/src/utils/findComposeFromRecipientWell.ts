import { ComposeViewState, composeStore } from 'owa-mail-compose-store';
import getRecipientWellValues from './getRecipientWellValues';
import type ReadWriteRecipientWellViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientWellViewState';
import type { RecipientsCollection } from '../schema/RecipientsCollection';

export default function findComposeFromRecipientWell(
    recipientWell: ReadWriteRecipientWellViewState
): ComposeViewState {
    let currentViewState: ComposeViewState = null;
    let recipients: RecipientsCollection = null;
    if (recipientWell?.recipients) {
        for (const viewState of [...composeStore.viewStates.values()]) {
            recipients = getRecipientWellValues(viewState);
            if (
                recipients.toRecipients === recipientWell.recipients ||
                recipients.ccRecipients === recipientWell.recipients ||
                recipients.bccRecipients === recipientWell.recipients
            ) {
                currentViewState = viewState;
                break;
            }
        }
    }
    return currentViewState;
}
