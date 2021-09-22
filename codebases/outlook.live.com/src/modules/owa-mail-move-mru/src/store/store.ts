import type MruFolderCache from './schema/MoveToFolderMruState';
import { createStore } from 'satcheljs';

const defaultStore: MruFolderCache = {
    mruFolders: [],
    isInitialized: false,
};

export let getStore = createStore<MruFolderCache>('mruFolderCache', defaultStore);
const store = getStore();
export default store;
