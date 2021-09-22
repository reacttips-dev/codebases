import { ADDINS_CHANGE_SOURCE } from '../constants';
import { EditorViewState, lazyOperateContent } from 'owa-editor';
import type { CompositeEditorViewState } from 'owa-editor/lib/store/schema/CompositeEditorViewState';
import { ContentPosition } from 'roosterjs-editor-types';

export default function setSelectedData(viewState: EditorViewState, content: string) {
    return lazyOperateContent.import().then(operateContent => {
        operateContent(
            viewState as CompositeEditorViewState,
            (htmlEditor, originalRange) => {
                const contentPosition = originalRange
                    ? ContentPosition.SelectionStart
                    : ContentPosition.End;
                htmlEditor.addUndoSnapshot(() => {
                    htmlEditor.insertContent(content, {
                        position: contentPosition,
                        updateCursor: true,
                        replaceSelection: true,
                        insertOnNewLine: false,
                    });
                }, ADDINS_CHANGE_SOURCE);

                return originalRange;
            },
            (value, selectionStart, selectionEnd) => {
                return {
                    value:
                        value.substring(0, selectionStart) +
                        content +
                        value.substring(selectionEnd + 1),
                    selectionStart: selectionStart,
                    selectionEnd: selectionEnd,
                    focus: true,
                };
            }
        );
    });
}
