import type FolderTreeViewStateStore from './schema/FolderTreeViewStateStore';
import type MailFolderNodeViewState from './schema/MailFolderNodeViewState';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

// Import mutators so they are initialized at the same time as the store
import '../mutators/updateFolderCountsMutator';

const initialFolderTreeViewStateStore: FolderTreeViewStateStore = {
    folderNodeViewStates: new ObservableMap<string, MailFolderNodeViewState>({}),
    contextMenuState: null,
    folderTextFieldViewState: null,
    isDraggedOver: false,
    withContextMenuFolderId: null,
};

export const getStore = createStore<FolderTreeViewStateStore>(
    'folderViewState',
    initialFolderTreeViewStateStore
);
const store = getStore();
export default store;
