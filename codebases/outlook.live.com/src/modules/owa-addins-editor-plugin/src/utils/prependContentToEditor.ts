import { ADDINS_CHANGE_SOURCE } from '../constants';
import { EditorViewState, lazyOperateContent } from 'owa-editor';
import type { CompositeEditorViewState } from 'owa-editor/lib/store/schema/CompositeEditorViewState';
import { ContentPosition } from 'roosterjs-editor-types';

export default function prependContentToEditor(viewState: EditorViewState, content: string) {
    return lazyOperateContent.import().then(operateContent => {
        operateContent(
            viewState as CompositeEditorViewState,
            (htmlEditor, originalRange) => {
                htmlEditor.focus();
                htmlEditor.addUndoSnapshot(() => {
                    htmlEditor.insertContent(content, {
                        position: ContentPosition.Begin,
                        updateCursor: false,
                        replaceSelection: false,
                        insertOnNewLine: false,
                    });
                }, ADDINS_CHANGE_SOURCE);

                return originalRange;
            },
            (value, selectionStart, selectionEnd) => {
                return {
                    value: content + value,
                    selectionStart: selectionStart,
                    selectionEnd: selectionEnd,
                    focus: true,
                };
            }
        );
    });
}
