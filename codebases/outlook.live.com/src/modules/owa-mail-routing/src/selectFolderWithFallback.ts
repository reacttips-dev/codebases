import {
    selectDefaultFolder,
    selectFolderWithFallbackInFolderForest,
} from 'owa-mail-folder-forest-actions';

export default function selectFolderWithFallback(routerFolderId: string) {
    // if no id is specified in the URL, select default folder
    if (!routerFolderId) {
        selectDefaultFolder('Route');
        return;
    }

    selectFolderWithFallbackInFolderForest(routerFolderId, 'Route');
}
