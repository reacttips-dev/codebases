import type { FilesViewStore } from './schema/FilesViewStore';
import { FilesTreeLoadState } from 'owa-mail-attachment-folder';
import { createStore } from 'satcheljs';

const filesViewStore: FilesViewStore = {
    loadState: FilesTreeLoadState.notLoaded,
    isExpanded: true,
};

export const getStore = createStore<FilesViewStore>('filesViewStore', filesViewStore);
export default getStore;
