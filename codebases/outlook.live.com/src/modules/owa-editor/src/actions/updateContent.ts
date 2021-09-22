import { mutatorAction } from 'satcheljs';
import type EditorViewState from '../store/schema/EditorViewState';
import setIsDirty from './setIsDirty';
import { logUsage } from 'owa-analytics';
import type { CompositeEditorViewState } from '../store/schema/CompositeEditorViewState';

export default function (viewState: EditorViewState, content: string, isInitializing?: boolean) {
    if (viewState.content != content) {
        updateContent(viewState, content);

        if (!isInitializing) {
            // If this is the first time to update the content during intializing, don't set isDirty as true.
            setIsDirty(viewState, true /*isDirty*/);
        }

        // This check is not 100% accurate. It is possible that the body content has the searched string. That is ok.
        // Because this is just help us identify the root cause of 108089, some false positive just add some logs,
        // but it won't miss any true positive.
        if (content?.indexOf('data-ogsc=') > 0) {
            const error = new Error();
            const isDarkMode = (<any>viewState).isDarkMode; // Workaround, for scenario other than mail compose, viewState won't have this value. This is only for temporary logging.
            const bodyType = isCompositeEditorViewState(viewState) ? viewState.bodyType : '';
            const activeEditor = isCompositeEditorViewState(viewState)
                ? viewState.preferredEditors[bodyType]
                : '';

            logUsage('DebugEditor108089', {
                eventName: 'NoColorTransform',
                editorId: viewState.editorId,
                callstack: error.stack,
                length: content.length,
                isInitializing,
                isDarkMode,
                bodyType,
                activeEditor,
            });
        }
    }
}

const updateContent = mutatorAction(
    'Editor_UpdateContent',
    (viewState: EditorViewState, content: string) => {
        viewState.content = content;
    }
);

function isCompositeEditorViewState(state: EditorViewState): state is CompositeEditorViewState {
    return !!(<any>state).preferredEditors;
}
