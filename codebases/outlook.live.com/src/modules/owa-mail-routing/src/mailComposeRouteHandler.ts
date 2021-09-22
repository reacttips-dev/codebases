import { composeStore } from 'owa-mail-compose-store';
import { lazyDiscardCompose, lazyLoadDraftToCompose } from 'owa-mail-compose-actions';
import { lazyNewMessage } from 'owa-mail-message-actions';
import selectFolderWithFallback from './selectFolderWithFallback';

export interface MailFolderRouteParameters {
    folderId?: string;
    draftId?: string;
}

export async function mailComposeNavigationRouteHandler(parameters: MailFolderRouteParameters) {
    selectFolderWithFallback(parameters.folderId);

    if (parameters.draftId) {
        await lazyLoadDraftToCompose.importAndExecute(parameters.draftId, null /* sxsId */);
    } else {
        await lazyNewMessage.importAndExecute('Route');
    }
}

export function mailComposeCleanupRouteHandler(): Promise<boolean> | boolean {
    if (composeStore.primaryComposeId) {
        return lazyDiscardCompose
            .importAndExecute(composeStore.viewStates.get(composeStore.primaryComposeId))
            .then(
                () => false, // Confirm ('Discard draft') means we should not block navigation
                () => true
            ); // Cancel ('Dont' discard') means we should block navigation
    } else {
        return false;
    }
}
