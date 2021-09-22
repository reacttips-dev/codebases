import type { ComposeViewState } from 'owa-mail-compose-store';
import { getFolderIdForSelectedNode } from 'owa-mail-folder-forest-store';
import { setIsDraftQueuedForSubmission } from 'owa-mail-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { action } from 'satcheljs/lib/legacy';

export default action('setIsSending')(function setIsSending(
    viewState: ComposeViewState,
    isSending: boolean
) {
    viewState.isSending = isSending;

    // VSO 40169: In the drafts folder, set flag to indicate is queued for submission
    // This will be used when checking what UI properties need to be dismissed in ItemHeader
    if (getFolderIdForSelectedNode() === folderNameToId('drafts')) {
        setIsDraftQueuedForSubmission(viewState.itemId, isSending);
    }
});
