import type EditorViewState from '../store/schema/EditorViewState';
import type EditorScenarios from '../store/schema/EditorScenarios';

let nextEditorId = 0;

function getNextEditorId(scenario: EditorScenarios): string {
    return `${scenario}_${nextEditorId++}`;
}

export default function createEditorViewState(
    scenario: EditorScenarios,
    content: string = null,
    isDirty: boolean = false
): EditorViewState {
    return {
        editorId: getNextEditorId(scenario),
        content: content,
        isDirty: isDirty,
        textDirection: null,
        keyStrokeCount: 0,
        selectedImage: null,
    };
}
