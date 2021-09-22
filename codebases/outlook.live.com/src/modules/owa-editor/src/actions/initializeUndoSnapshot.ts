import createSnapshots from 'roosterjs-editor-dom/lib/snapshots/createSnapshots';
import type EditorViewState from '../store/schema/EditorViewState';
import { mutatorAction } from 'satcheljs';

const MAX_UNDO_SNAPSHOT_SIZE = 1e7;

export default mutatorAction('Editor_Initialize_Undo_Snapshot', (viewState: EditorViewState) => {
    viewState.undoSnapshot = createSnapshots(MAX_UNDO_SNAPSHOT_SIZE);
});
