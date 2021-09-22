import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type ReadWriteRecipientWellViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientWellViewState';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';

export default function isRecipientWellWithFindControlViewState(
    viewState:
        | FindControlViewState
        | RecipientWellWithFindControlViewState
        | ReadWriteRecipientWellViewState
): viewState is RecipientWellWithFindControlViewState {
    return (
        (viewState as RecipientWellWithFindControlViewState).recipients !== undefined &&
        (viewState as RecipientWellWithFindControlViewState).findResultSet !== undefined
    );
}
