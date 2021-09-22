import type { SubjectViewState } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'updateSubjectSelectionRange',
    (viewState: SubjectViewState, start: number, end: number) => {
        viewState.selectionStart = start;
        viewState.selectionEnd = end;
    }
);
