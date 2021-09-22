import type { ComposeViewState } from 'owa-mail-compose-store';
import isSmimeSupportedInCompose from 'owa-mail-compose-actions/lib/utils/isSmimeSupportedInCompose';
import { mailStore } from 'owa-mail-store';
import type Item from 'owa-service/lib/contract/Item';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isBrowserSupported } from 'owa-smime-adapter/lib/utils/smimeUtils';

/**
 * Hide S/MIME message options
 * 1. For consumer.
 * 2. If the browser is not supported for S/MIME.
 * 3. ParentItem/Draft itemClass not supported for S/MIME.
 */
const shouldShowSmimeOptions = (composeViewState: ComposeViewState): boolean => {
    if (isConsumer() || !isBrowserSupported()) {
        return false;
    }

    const { operation, referenceItemId, itemId, meetingRequestItem } = composeViewState;
    let item: Item = null;

    if (referenceItemId) {
        // This is reply/forward scenario
        item = mailStore.items.get(referenceItemId.Id) || meetingRequestItem;
    } else if (itemId) {
        item = mailStore.items.get(itemId.Id);
    }

    return item ? isSmimeSupportedInCompose(operation, item) : true;
};

export default shouldShowSmimeOptions;
