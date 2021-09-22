import setForceResolveState from 'owa-readwrite-recipient-well/lib/actions/setForceResolveState';
import type RecipientWellWithFindControlViewState from 'owa-recipient-types/lib/types/RecipientWellWithFindControlViewState';
import type ReadWriteRecipientViewState from 'owa-recipient-types/lib/types/ReadWriteRecipientViewState';
import { IEditor, PositionType } from 'roosterjs-editor-types';
import { action } from 'satcheljs/lib/legacy';
import { RECIPIENT_TEXT_CLASSNAME } from 'owa-recipient-editor/lib/constants';
import openRecipientPicker from 'owa-recipient-editor/lib/util/openRecipientPicker';
import { getRecipientEditorFromId } from 'owa-recipient-editor/lib/util/recipientEditorSave';

export default action('resolveAllUnresolvedRecipientsInEdit')(
    function resolveAllUnresolvedRecipientsInEdit(
        viewState: RecipientWellWithFindControlViewState,
        editor?: IEditor,
        startAtIndex?: number
    ): void {
        setForceResolveState(viewState, true);
        let indexToRemove = -1;
        for (let i = startAtIndex || 0; i < viewState.recipients.length; i++) {
            const recipient = viewState.recipients[i];

            if (!recipient.isValid) {
                indexToRemove = i;
                break;
            }
        }

        if (indexToRemove !== -1) {
            onEditingStarted(
                viewState.recipients[indexToRemove],
                editor || getRecipientEditorFromId(viewState.recipientWellId)
            );
        } else {
            setForceResolveState(viewState, false);
        }
    }
);

function onEditingStarted(recipient: ReadWriteRecipientViewState, editor?: IEditor) {
    if (editor) {
        // find the corresponding UI
        const recipientElement = editor.queryElements('#' + recipient.key);
        const textElement = recipientElement[0].getElementsByClassName(RECIPIENT_TEXT_CLASSNAME)[0];
        // set selection
        editor.select(textElement, PositionType.End);
        // trigger picker
        openRecipientPicker(editor);
    }
}
