import createNodeWithContent from './createNodeWithContent';
import removeAppendOnSend from '../actions/removeAppendOnSend';
import {
    AddinViewState,
    CoercionType,
} from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';

import { logUsage } from 'owa-analytics';
import { lazyOperateContent } from 'owa-editor';
import type { CompositeEditorViewState } from 'owa-editor/lib/store/schema/CompositeEditorViewState';
import type EditorViewState from 'owa-editor/lib/store/schema/EditorViewState';
import { ContentPosition } from 'roosterjs-editor-types';
import { ADDINS_CHANGE_SOURCE } from '../constants';

export default async function insertAppendOnSend(
    editorViewState: EditorViewState,
    addinViewState: AddinViewState
) {
    const appendOnSend = addinViewState.appendOnSend;

    if (appendOnSend.length == 0) {
        // Only try to update content if there are addins wanting to append on send
        return;
    }

    let stringToAppend: string = '';
    const name = 'ComposeAppendOnSend';

    const operateContent = await lazyOperateContent.import();
    operateContent(
        editorViewState as CompositeEditorViewState,
        (htmlEditor, originalRange, domUtils) => {
            appendOnSend.map(value => {
                let textToAppend: string = value.txt;
                if (value.typ === CoercionType.Text) {
                    textToAppend = escapeAppendOnSendForHtml(textToAppend);
                }
                stringToAppend += textToAppend;
            });
            if (stringToAppend.length > 0) {
                const div: HTMLElement[] = htmlEditor.queryElements('div#appendonsend');

                htmlEditor.addUndoSnapshot(() => {
                    if (div.length == 0) {
                        // div is not found
                        logUsage(name, ['End', 'HTML']);
                        htmlEditor.insertContent(stringToAppend, {
                            position: ContentPosition.End,
                            updateCursor: false,
                            replaceSelection: false,
                            insertOnNewLine: true,
                        });
                    } else {
                        for (let i = 0; i < div.length; i++) {
                            const element: HTMLElement = div[i];
                            if (element.id === 'appendonsend' && element.innerHTML === '') {
                                logUsage(name, ['Div', 'HTML']);

                                const contentNode = createNodeWithContent(
                                    stringToAppend,
                                    htmlEditor.getDocument(),
                                    domUtils
                                );
                                element.appendChild(contentNode);

                                break;
                            }
                        }
                    }
                }, ADDINS_CHANGE_SOURCE);
            }
            removeAppendOnSend(addinViewState);
            return null;
        },
        (value, selectionStart, selectionEnd) => {
            appendOnSend.map(value => {
                if (value.typ !== CoercionType.Html) {
                    stringToAppend += '\n' + value.txt;
                }
            });
            let newContent = value;
            if (stringToAppend.length > 0) {
                logUsage(name, ['End', 'Text']);
                newContent += stringToAppend;
            }
            removeAppendOnSend(addinViewState);
            return {
                value: newContent,
                selectionStart: selectionStart,
                selectionEnd: selectionEnd,
                focus: true,
            };
        }
    );
}

function escapeAppendOnSendForHtml(content: string) {
    content = content.replace(/&/g, '&amp;');
    content = content.replace(/</g, '&lt;');
    content = content.replace(/>/g, '&gt;');
    content = content.replace(/"/g, '&quot;');
    content = content.replace(/'/g, '&#39;');
    content = content.replace(/\//g, '&#x2F;');
    return content;
}
