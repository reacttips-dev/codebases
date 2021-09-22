import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';
import type { MailFolder } from 'owa-graph-schema';

export interface PublicFolderStore {
    folderTable: ObservableMap<string, MailFolder>; // where we store the loaded folders
    rootFolder: MailFolder; // root folder corresponding to IPM_SUBTREE
}

let initialState: PublicFolderStore = {
    folderTable: new ObservableMap<string, MailFolder>(),
    rootFolder: null,
};

let publicFolderFavoriteStore = createStore<PublicFolderStore>(
    'publicFolderFavoriteStore',
    initialState
)();

export default publicFolderFavoriteStore;
