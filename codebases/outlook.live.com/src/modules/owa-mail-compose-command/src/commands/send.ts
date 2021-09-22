import closeCompose from 'owa-mail-compose-actions/lib/actions/closeCompose';
import isPublicFolderComposeViewState from 'owa-mail-compose-store/lib/utils/isPublicFolderComposeViewState';
import trySaveMessage from 'owa-mail-compose-actions/lib/actions/trySaveMessage';
import trySendMessage from 'owa-mail-compose-actions/lib/actions/trySendMessage';
import updateContentToViewState from 'owa-editor/lib/utils/updateContentToViewState';
import type { ComposeViewState } from 'owa-mail-compose-store';
import type TempEditorRef from 'owa-editor/lib/utils/TempEditorRef';
import type { TempRecipientEditorRef } from 'owa-recipient-editor/lib/util/TempRecipientEditorRef';
import { triggerRecipientSave } from 'owa-recipient-editor/lib/util/recipientEditorSave';
import getRecipientWellViewStates from '../utils/getRecipientWellViewStates';

export default function send(
    viewState: ComposeViewState,
    targetWindow: Window,
    editorRef?: TempEditorRef, // TODO: 108089 Remove this parameter when root cause is fixed,
    recipientEditorRef?: TempRecipientEditorRef
) {
    updateContentToViewState(viewState, editorRef);
    triggerRecipientSave(getRecipientWellViewStates(viewState), recipientEditorRef);

    if (isPublicFolderComposeViewState(viewState)) {
        trySaveMessage(viewState);
        closeCompose(viewState, 'SavePublicFolder');
    } else {
        trySendMessage(viewState, targetWindow).catch(error => error);
    }
}
