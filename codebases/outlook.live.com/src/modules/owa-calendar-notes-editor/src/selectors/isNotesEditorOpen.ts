import getNotesEditorViewState from '../selectors/getNotesEditorViewState';

export function isNotesEditorOpen(id: string) {
    return !!getNotesEditorViewState(id);
}
