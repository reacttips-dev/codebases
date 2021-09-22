import getNotesEditorViewState from '../selectors/getNotesEditorViewState';

export function isNotesEditorDirty(id: string) {
    const viewState = getNotesEditorViewState(id);

    return viewState && (viewState.isDirty || viewState.forwardees?.length > 0);
}
