import { action } from 'satcheljs/lib/legacy';
import type { ActionSource } from 'owa-mail-store';
import { composeStore } from 'owa-mail-compose-store';
import { lazyNewMessage } from '../index';
import { isFeatureEnabled } from 'owa-feature-flags';

// VSO 29687: Check if a new message is in the process of being created,
// and if not (or complete), create a new message
export default action('checkAndCreateNewMessage')(function checkAndCreateNewMessage(
    actionSource: ActionSource,
    targetId: string | null
) {
    if (!composeStore.newMessageCreationInProgress) {
        composeStore.newMessageCreationInProgress = true;
        try {
            return lazyNewMessage.importAndExecute(
                actionSource,
                targetId,
                undefined /* toEmailAddressWrappers */,
                undefined /* subject */,
                undefined /* body */,
                isFeatureEnabled('mon-cmp-newMessageInNewWindow')
            );
        } finally {
            composeStore.newMessageCreationInProgress = false;
        }
    }

    return Promise.resolve();
});
