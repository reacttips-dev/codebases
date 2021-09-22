import { createStore } from 'satcheljs';

export interface UndoStore {
    hasUndoableAction: boolean;
    undoableActionFolderId: string | null;
}

const undoStoreData = {
    hasUndoableAction: false,
    undoableActionFolderId: null,
};

export const getUndoStore = createStore<UndoStore>('undo', undoStoreData);
const undoStore = getUndoStore();
export default undoStore;
