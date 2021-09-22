import type FolderStore from './schema/FolderStore';
import { createStore } from 'satcheljs';
import { ObservableMap } from 'mobx';

const getStore = createStore<FolderStore>('folderStore', {
    folderTable: new ObservableMap(),
    mailboxFolderTreeData: new ObservableMap(),
});

export const folderStore = getStore();
export default getStore;
