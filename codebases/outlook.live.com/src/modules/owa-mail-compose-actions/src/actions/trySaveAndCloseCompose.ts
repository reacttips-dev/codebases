import { ComposeOperation, composeStore, ComposeViewState } from 'owa-mail-compose-store';
import isPublicFolderComposeViewState from 'owa-mail-compose-store/lib/utils/isPublicFolderComposeViewState';
import { validateSave } from '../utils/validateSave';
import { isViewStateDirty } from '../utils/viewStateUtils';
import closeCompose from './closeCompose';
import discardCompose from './discardCompose';
import setIsSavingSpinnerShown from './setIsSavingSpinnerShown';
import trySaveMessage, { waitForActiveSaving } from './trySaveMessage';

export default async function trySaveAndCloseCompose(viewState: ComposeViewState): Promise<void> {
    viewState = viewState || composeStore.viewStates.get(composeStore.primaryComposeId);

    if (viewState) {
        // TODO: 78254 [Projection] Attachment block on save dialog in Projection popout
        if ((await validateSave(viewState, window)) !== null) {
            return;
        }

        //If it is a Post scenario, we want to discard compose on closing it
        if (isPublicFolderComposeViewState(viewState)) {
            return discardCompose(viewState);
        }

        await waitForActiveSaving(viewState);

        if (isViewStateDirty(viewState)) {
            setIsSavingSpinnerShown(viewState, true /*isShown*/);
            return trySaveMessage(viewState, false /*isAutoSave*/, true /*rejectWhenFail*/)
                .then(() => {
                    setIsSavingSpinnerShown(viewState, false /*isShown*/);
                    return closeCompose(viewState, 'SaveAndClose');
                })
                .catch(() => {
                    setIsSavingSpinnerShown(viewState, false /*isShown*/);
                });
        } else if (
            viewState.itemId &&
            viewState.operation != ComposeOperation.EditDraft &&
            !viewState.lastSaveTimeStamp
        ) {
            // item has upgraded (has itemId but doesn't have lastSaveTimeStamp) but item is not dirty in R/RA/F scenario, we should delete the draft
            return discardCompose(viewState);
        } else {
            return closeCompose(viewState, 'SaveAndClose');
        }
    }
}
