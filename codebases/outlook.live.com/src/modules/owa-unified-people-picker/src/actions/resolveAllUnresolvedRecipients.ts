import setForceResolveState from 'owa-readwrite-recipient-well/lib/actions/setForceResolveState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import onEditingItemStarted from '../utils/onEditingItemStarted';
import resolveQueryStringToRecipient from 'owa-readwrite-recipient-well/lib/actions/resolveQueryStringToRecipient';
import { action } from 'satcheljs/lib/legacy';

export default action('resolveAllUnresolvedRecipients')(
    async function resolveAllUnresolvedRecipients(
        viewState: RecipientWellWithFindControlViewState,
        startAtIndex?: number,
        onBeforeWaitingResolve?: () => void,
        delayEdit?: boolean
    ): Promise<void> {
        setForceResolveState(viewState, true);
        // Trim the query string prior to resolving in case of just empty spaces in the send scenario.
        viewState.queryString = viewState.queryString.trim();
        if (viewState.recipients && viewState.queryString) {
            onBeforeWaitingResolve?.();
            await resolveQueryStringToRecipient(
                viewState,
                false /* shouldDirectlyResolve */,
                true /* searchDirectory */,
                true /* resolveIfSingle */
            );
        } else {
            let indexToRemove = -1;
            for (let i = startAtIndex || 0; i < viewState.recipients.length; i++) {
                const recipient = viewState.recipients[i];

                if (!recipient.isValid) {
                    indexToRemove = i;
                    break;
                }
            }

            if (indexToRemove !== -1) {
                if (delayEdit) {
                    window.requestAnimationFrame(() => {
                        onEditingItemStarted(
                            viewState.recipients[indexToRemove],
                            indexToRemove,
                            viewState
                        );
                    });
                } else {
                    onEditingItemStarted(
                        viewState.recipients[indexToRemove],
                        indexToRemove,
                        viewState
                    );
                }
            } else {
                // base case for when we're done resolving
                setForceResolveState(viewState, false);
            }
        }
    }
);
