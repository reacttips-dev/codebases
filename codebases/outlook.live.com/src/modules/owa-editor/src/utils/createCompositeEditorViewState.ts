import type BodyType from 'owa-service/lib/contract/BodyType';
import createEditorViewState from './createEditorViewState';
import type { CompositeEditorViewState } from '../store/schema/CompositeEditorViewState';
import { getDefaultPreferredEditorTypes } from 'owa-mail-preferred-editor/lib/preferredEditorTypes';
import type EditorScenarios from '../store/schema/EditorScenarios';

export function createCompositeEditorViewState(
    scenario: EditorScenarios,
    content: string,
    bodyType: BodyType
): CompositeEditorViewState {
    return {
        ...createEditorViewState(scenario, content, false /*isDirty*/),
        bodyType,
        preferredEditors: getDefaultPreferredEditorTypes(),
        isFocusWorkaroundDivShown: true,
        selectionStart: null,
        selectionEnd: null,
    };
}
