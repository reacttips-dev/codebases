import { createStore } from 'satcheljs';
import type FrequentlyUsedFoldersStore from './schema/FrequentlyUsedFoldersStore';
import { ObservableMap } from 'mobx';

// Register mutators
import '../mutators/folderPrefetchedMutator';

const defaultStore: FrequentlyUsedFoldersStore = {
    frequentlyUsedFolders: [],
    isInitialized: false,
    prefetchedFolderIds: new ObservableMap({}),
};

export let getStore = createStore<FrequentlyUsedFoldersStore>(
    'frequentlyUsedFoldersStore',
    defaultStore
);

const store = getStore();
export default store;
