import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';

export default function getNumberInvalidRecipients(
    recipientWell: RecipientWellWithFindControlViewState
): number {
    let countInvalid = 0;
    for (let recipient of recipientWell.recipients) {
        countInvalid += recipient.isValid ? 1 : 0;
    }
    return countInvalid;
}
