import { ComposeViewState } from 'owa-mail-compose-store';
import isPublicFolderComposeViewState from 'owa-mail-compose-store/lib/utils/isPublicFolderComposeViewState';
import updateContentToViewState from 'owa-editor/lib/utils/updateContentToViewState';
import trySaveMessage, { isSaving } from 'owa-mail-compose-actions/lib/actions/trySaveMessage';
import { isViewStateDirty } from 'owa-mail-compose-actions/lib/utils/viewStateUtils';
import type TempEditorRef from 'owa-editor/lib/utils/TempEditorRef';
import { getPendingAttachmentString } from 'owa-attachment-block-on-send/lib/directIndex';
import { isStringNullOrWhiteSpace } from 'owa-localize';
import type { TempRecipientEditorRef } from 'owa-recipient-editor/lib/util/TempRecipientEditorRef';
import { triggerRecipientSave } from 'owa-recipient-editor/lib/util/recipientEditorSave';
import getRecipientWellViewStates from '../utils/getRecipientWellViewStates';

export default function save(
    viewState: ComposeViewState,
    isAutoSave?: boolean,
    editorRef?: TempEditorRef,
    recipientEditorRef?: TempRecipientEditorRef
) {
    // don't auto save
    // if it is a public folder compose
    // or item creation is in progress
    // or there are pending attachments
    if (
        !isAutoSave ||
        (!hasPendingAttachments(viewState) &&
            !isPublicFolderComposeViewState(viewState) &&
            !isSaving(viewState) &&
            isViewStateDirty(viewState))
    ) {
        updateContentToViewState(viewState, editorRef);
        triggerRecipientSave(getRecipientWellViewStates(viewState), recipientEditorRef);
        trySaveMessage(viewState, isAutoSave);
    }
}

function hasPendingAttachments(viewState: ComposeViewState): boolean {
    const hasWaitingAttachments = viewState.numberOfWaitingAttachments > 0;
    if (hasWaitingAttachments) {
        return true;
    }

    return !isStringNullOrWhiteSpace(
        getPendingAttachmentString(viewState.attachmentWell, hasWaitingAttachments)
    );
}
