import { orchestrator } from 'satcheljs';
import onRemoveRecipientFromMailTip from '../actions/onRemoveRecipientFromMailTip';
import type { ComposeViewState } from 'owa-mail-compose-store';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import { getRecipientWellsFromComposeViewState } from '../utils/getAllRecipientsAsEmailAddressStrings';
import removeRecipientsFromRecipientWells from 'owa-readwrite-recipient-well/lib/actions/removeRecipientsFromRecipientWells';
import switchToReadWriteRecipient from '../actions/switchToReadWriteRecipient';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';

/**
 * This orchestrator get triggered when "Remove Recipient" is clicked from mailtips.
 * It then removes the recipient from recipientWells ie. To/Cc/Bcc and expands the
 * compact recipient well.
 */
export default orchestrator(onRemoveRecipientFromMailTip, actionMessage => {
    const viewState: ComposeViewState = actionMessage.viewState;
    const recipients: EmailAddressWrapper[] = actionMessage.recipients;
    const recipientWells: RecipientWellWithFindControlViewState[] = getRecipientWellsFromComposeViewState(
        viewState
    );

    removeRecipientsFromRecipientWells(recipients, recipientWells);
    if (viewState.showCompactRecipientWell) {
        switchToReadWriteRecipient(viewState);
    }
});
