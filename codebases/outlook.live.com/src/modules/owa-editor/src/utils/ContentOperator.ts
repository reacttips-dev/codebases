import type EditorViewState from '../store/schema/EditorViewState';
import type { CompositeEditorViewState } from '../store/schema/CompositeEditorViewState';
import type { IEditor } from 'roosterjs-editor-types';
import { logUsage } from 'owa-analytics';

export interface ContentOperator {
    htmlEditor: IEditor;
    plainTextEditor: HTMLTextAreaElement;
}

let contentOperatorMap: { [editorId: number]: ContentOperator } = {};
const DEBUG_108089_NAME = 'DebugEditor108089';

export function addContentOperator(
    viewState: EditorViewState,
    htmlEditor: IEditor,
    plainTextEditor: HTMLTextAreaElement
) {
    const existingHtmlEditor = contentOperatorMap[viewState.editorId]?.htmlEditor;

    if (htmlEditor && existingHtmlEditor) {
        const originalWindow = existingHtmlEditor.getDocument().defaultView;
        const newWindow = htmlEditor.getDocument().defaultView;
        const inSameWindow = originalWindow == newWindow;
        const OriginalInProjection = window != originalWindow;
        const NewInProjection = window != newWindow;
        const NewWindowHasOpener = safeRun(() => (newWindow.opener ? 'true' : 'false'));
        const NewWindowIsIFrame = safeRun(() => (newWindow.parent == newWindow ? 'false' : 'true'));
        const NewWindowUrl = safeRun(() =>
            newWindow.location.href.replace(/\/[^\/]*@[^\/]+\//, '/<PII>/')
        );

        logUsage(DEBUG_108089_NAME, {
            eventName: 'DuplicatedEditor',
            inSameWindow,
            OriginalInProjection,
            NewInProjection,
            NewWindowHasOpener,
            NewWindowIsIFrame,
            NewWindowUrl,
            editorId: viewState.editorId,
        });
    }

    // It is possible there is already content operator for this viewstate
    // in that case, the latest one wins.
    // TODO: (108089) We need to rethink about this, and we should not allow this happen
    contentOperatorMap[viewState.editorId] = {
        htmlEditor: htmlEditor,
        plainTextEditor: plainTextEditor,
    };
}

function safeRun(callback: () => string): string {
    try {
        return callback();
    } catch {
        return 'error';
    }
}

export function removeContentOperator(
    viewState: EditorViewState,
    htmlEditor: IEditor,
    plainTextEditor: HTMLTextAreaElement
) {
    const operator = contentOperatorMap[viewState.editorId];
    let removed = false;
    if (operator) {
        if (operator.htmlEditor == htmlEditor) {
            operator.htmlEditor = null;
            removed = true;
        }
        if (operator.plainTextEditor == plainTextEditor) {
            operator.plainTextEditor = null;
            removed = true;
        }
        if (!operator.htmlEditor && !operator.plainTextEditor) {
            delete contentOperatorMap[viewState.editorId];
        }
    }

    if (!removed && htmlEditor) {
        logUsage(DEBUG_108089_NAME, {
            eventName: 'NoEditorToRemove',
            hasOperator: !!operator,
            hasOriginalEditor: !!operator?.htmlEditor,
            removingEditorId: viewState.editorId,
        });
    }
}

/**
 * Operate content using editor from its viewState.
 *
 * !!!    WARNING: Do NOT directly import this function outside owa-editor package    !!!
 * !!! This is only an internal function used for building APIs for content operation !!!
 *
 * @param viewState The EditorViewState to operate on
 * @param htmlCallback Callback for HTML editor (roosterjs)
 * @param plainTextCallback Callback for PlainText editor
 * @param alwaysInvokeCallback By default, callback won't be invoked if there isn't a correlated
 * editor. Setting this parameter to true to force invoke callback even editor doesn't exist.
 * When this is set to true, callback has the responsibility to do null check of editor instance.
 */
export default function operateContentInternal(
    viewState: EditorViewState,
    htmlCallback: (editor: IEditor) => void,
    plainTextCallback: (editor: HTMLTextAreaElement) => void,
    alwaysInvokeCallback?: boolean,
    contentOperatorOverride?: ContentOperator
) {
    if (viewState) {
        // bodyType doesn't exist in EditorViewState, so we treat undefined as HTML
        const bodyType = (<CompositeEditorViewState>viewState).bodyType;
        const isHTML = bodyType === undefined || bodyType === 'HTML';
        const isText = bodyType === 'Text';
        const { htmlEditor, plainTextEditor } =
            contentOperatorOverride || contentOperatorMap[viewState.editorId] || {};

        if (
            isHTML &&
            htmlCallback &&
            ((htmlEditor && !htmlEditor.isDisposed()) || alwaysInvokeCallback)
        ) {
            htmlCallback(htmlEditor);

            // TODO: 108089 Remove the code below once root cause is fixed
            const savedEditor = contentOperatorMap[viewState.editorId]?.htmlEditor;
            if (htmlEditor && savedEditor && htmlEditor != savedEditor) {
                logUsage(DEBUG_108089_NAME, {
                    eventName: 'OperateWrongEditor',
                    editorId: viewState.editorId,
                });
            }
        } else if (isText && plainTextCallback && (plainTextEditor || alwaysInvokeCallback)) {
            plainTextCallback(plainTextEditor);
        }
    }
}
