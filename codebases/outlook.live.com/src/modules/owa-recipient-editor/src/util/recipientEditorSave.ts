import type { RecipientEditors } from './TempRecipientEditorRef';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type { IEditor } from 'roosterjs-editor-types';

let recipientEditorsMap: { [recipientWellId: string]: IEditor } = {};

export function triggerRecipientSave(
    recipientViewStates: RecipientWellWithFindControlViewState[],
    recipientEditors?: RecipientEditors
) {
    // If we've got a ref to the plugin with the editors, use those
    if (recipientEditors) {
        for (const editor of recipientEditors.recipientEditors) {
            editor.getContent();
        }
    }
    // if not (ribbon case) find the editors in our map
    else {
        for (const viewState of recipientViewStates) {
            recipientEditorsMap[viewState.recipientWellId]?.getContent();
        }
    }
}

export function addRecipientEditor(recipientWellId: string, editor: IEditor) {
    recipientEditorsMap[recipientWellId] = editor;
}

export function deleteRecipientEditor(recipientWellId: string) {
    delete recipientEditorsMap[recipientWellId];
}

export function getRecipientEditorFromId(id: string) {
    return recipientEditorsMap[id];
}
