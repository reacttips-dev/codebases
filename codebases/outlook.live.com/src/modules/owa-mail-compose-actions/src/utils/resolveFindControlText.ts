import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import resolveQueryStringToRecipient from 'owa-readwrite-recipient-well/lib/actions/resolveQueryStringToRecipient';

export default function resolveFindControlText(
    wellViewState: RecipientWellWithFindControlViewState
) {
    if (wellViewState?.queryString && wellViewState.queryString.length > 0) {
        resolveQueryStringToRecipient(wellViewState, true /*shouldDirectlyResolve */);
    }
}
