import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';
import type { MailFolder } from 'owa-graph-schema';

export interface PublicFolder extends MailFolder {
    isExpanded: boolean;
    ChildFolderCount: number;
}

export interface PublicFolderStore {
    folderTable: ObservableMap<string, PublicFolder>; // where we store the loaded folders
    rootFolder: PublicFolder; // root folder corresponding to IPM_SUBTREE
}

const initialState: PublicFolderStore = {
    folderTable: new ObservableMap<string, PublicFolder>({}),
    rootFolder: null,
};

export default createStore<PublicFolderStore>('publicFolderTable', initialState)();
