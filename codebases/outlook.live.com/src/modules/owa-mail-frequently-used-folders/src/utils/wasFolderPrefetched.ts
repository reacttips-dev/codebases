import store from '../store/store';

export function wasFolderPrefetched(folderId: string): boolean {
    return store.prefetchedFolderIds.get(folderId) === true;
}
