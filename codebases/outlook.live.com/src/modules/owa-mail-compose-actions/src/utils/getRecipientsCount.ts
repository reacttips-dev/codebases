import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';

export default function getRecipientsCount(
    wellViewState: RecipientWellWithFindControlViewState
): number {
    return wellViewState?.recipients ? wellViewState.recipients.length : 0;
}
