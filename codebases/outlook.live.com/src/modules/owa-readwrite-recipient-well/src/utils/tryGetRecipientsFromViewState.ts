import isRecipientWellWithFindControlViewState from './isRecipientWellWithFindControlViewState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';

/**
 * If the view state is of RecipientWellWithFindControlViewState, get the recipients off the view state
 * Otherwise, return the given recipients, or empty array if undefined
 */
export default function tryGetRecipientsFromViewState(
    viewState: FindControlViewState | RecipientWellWithFindControlViewState,
    recipients?: ReadWriteRecipientViewState[]
): ReadWriteRecipientViewState[] {
    if (isRecipientWellWithFindControlViewState(viewState)) {
        return (viewState as RecipientWellWithFindControlViewState).recipients;
    }

    return recipients ? recipients : [];
}
