import { lazyOperateContent } from 'owa-editor';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { ContentPosition, PositionType } from 'roosterjs-editor-types';
import { safeInstanceOf } from 'roosterjs-editor-dom';

export default async function insertContentIntoEditor(
    viewState: ComposeViewState,
    htmlContent: string | Node,
    plainTextContent: string,
    insertContentPosition: ContentPosition,
    changeSource: string,
    dontSetFocusToEditor?: boolean
) {
    const belowExistingContent =
        insertContentPosition === ContentPosition.End ||
        insertContentPosition === ContentPosition.DomEnd;

    const htmlCallback = (editor, range, domUtils) => {
        const insertContentOption = {
            insertOnNewLine: belowExistingContent,
            position: insertContentPosition,
            replaceSelection: false,
            updateCursor: false,
        };

        editor.addUndoSnapshot(() => {
            if (safeInstanceOf(htmlContent, 'Node')) {
                editor.insertNode(htmlContent, insertContentOption);
            } else if (typeof htmlContent === 'string') {
                editor.insertContent(htmlContent, insertContentOption);
            }
        }, changeSource);

        // If the node was inserted at the beginning of the content, the cursor will need
        // to be updated to be behind the newly inserted node
        return (
            safeInstanceOf(htmlContent, 'Node') &&
            domUtils.createRange(htmlContent, PositionType.After)
        );
    };

    const plainTextCallback = (value, selectionStart, selectionEnd) => {
        if (belowExistingContent) {
            value += plainTextContent;
            // selectionStart and selectionEnd should stay the same,
            // because belowExistingContent denotes the cursor and
            // existing content should remain as is
        } else {
            value = value.substr(0, selectionStart) + plainTextContent + value.substr(selectionEnd);
            selectionStart += plainTextContent.length;
            selectionEnd += plainTextContent.length;
        }

        return {
            value: value,
            selectionStart: selectionStart,
            selectionEnd: selectionEnd,
            focus: !dontSetFocusToEditor,
        };
    };

    const operateContent = await lazyOperateContent.import();
    operateContent(viewState, htmlCallback, plainTextCallback);
}
