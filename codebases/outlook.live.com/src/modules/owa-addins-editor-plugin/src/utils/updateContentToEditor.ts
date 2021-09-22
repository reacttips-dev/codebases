import createNodeWithContent from './createNodeWithContent';
import { ADDINS_CHANGE_SOURCE } from '../constants';
import { lazyOperateContent } from 'owa-editor';
import { ContentPosition, PositionType, GetContentMode } from 'roosterjs-editor-types';
import type { CompositeEditorViewState } from 'owa-editor/lib/store/schema/CompositeEditorViewState';

export default function updateContentToEditor(
    viewState: CompositeEditorViewState,
    content: string
) {
    return lazyOperateContent.import().then(operateContent => {
        operateContent(
            viewState,
            (htmlEditor, originalRange, domUtils) => {
                if (htmlEditor.getContent(GetContentMode.RawHTMLOnly) == content) {
                    return null;
                }

                const contentNode = createNodeWithContent(
                    content,
                    htmlEditor.getDocument(),
                    domUtils
                );

                htmlEditor.addUndoSnapshot(() => {
                    // Set content to empty and do not trigger ContentChangedEvent to avoid Watermark plugin add watermark back.
                    // Otherwise the node will be inserted into the watermark SPAN then be deleted when focus
                    htmlEditor.setContent('', false /*triggerContentChangedEvent*/);

                    htmlEditor.insertNode(contentNode, {
                        position: ContentPosition.Begin,
                        updateCursor: true,
                        replaceSelection: false,
                        insertOnNewLine: false,
                    });
                }, ADDINS_CHANGE_SOURCE);

                return contentNode ? domUtils.createRange(contentNode, PositionType.After) : null;
            },
            (value, selectionStart, selectionEnd) => {
                return {
                    value: content,
                    selectionStart: 0,
                    selectionEnd: 0,
                };
            }
        );
    });
}
