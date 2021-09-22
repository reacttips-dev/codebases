import type { EditorViewState } from 'owa-editor';
import { callEditorApi } from 'owa-editor/lib/utils/callApi';
import { QueryScope } from 'roosterjs-editor-types';

export default function deleteContentWithSelector(viewState: EditorViewState, selector: string) {
    callEditorApi(viewState, 'queryElements', selector, QueryScope.Body, node =>
        node.parentNode.removeChild(node)
    );
}
