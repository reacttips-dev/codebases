import type { ComposeViewState } from 'owa-mail-compose-store';
import { getRecipientWellInstancesForId } from 'owa-readwrite-recipient-well-fabric/lib/store/registry';
import { trace } from 'owa-trace';

const focusToFirstUnresolvedRecipientWell = (viewState: ComposeViewState) => {
    [viewState.toRecipientWell, viewState.ccRecipientWell, viewState.bccRecipientWell].some(
        recipientWell => {
            // If there was a querystring set and it failed to be resolved,
            // then it will still be populated as non-empty on the
            // recipientWell.
            //
            // Focus to it so the user is prompted to resolve this recipient.
            if (recipientWell?.queryString && recipientWell.queryString.length > 0) {
                const instances = getRecipientWellInstancesForId(recipientWell.recipientWellId);
                if (instances.length === 1) {
                    const instance = instances[0];
                    instance.current && instance.current.focus();
                    return true;
                } else if (instances.length > 1) {
                    trace.warn(
                        `Found ${instances.length} instances of recipient well ${recipientWell.recipientWellId} during send failure. Using the first one.`
                    );
                }
            }
            return false;
        }
    );
};

export default focusToFirstUnresolvedRecipientWell;
