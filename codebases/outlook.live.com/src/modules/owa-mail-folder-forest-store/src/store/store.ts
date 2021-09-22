import { FolderForestNode, FolderForestNodeType } from 'owa-favorites-types';
import type FolderForestStore from './schema/FolderForestStore';
import { createStore } from 'satcheljs';

const defaultFolderForestStore: FolderForestStore = {
    selectedNode: <FolderForestNode>{
        id: null,
        treeType: 'primaryFolderTree',
        type: FolderForestNodeType.Folder,
    },
};

export let getStore = createStore<FolderForestStore>('folderForestStore', defaultFolderForestStore);

const folderForestStore = getStore();
export default folderForestStore;
