import removeFolderInListViewStore from '../actions/removeFolderInListViewStore';
import { createLazyOrchestrator } from 'owa-bundling';
import deleteFolderStoreUpdate from 'owa-mail-actions/lib/triage/deleteFolderStoreUpdate';

export const deleteFolderStoreUpdateOrchestrator = createLazyOrchestrator(
    deleteFolderStoreUpdate,
    'deleteFolderStoreUpdateClone',
    actionMessage => {
        const { folderIds } = actionMessage;

        // Delete each folder from the list view store
        // There could be multiple foldersIds if user is deleting a folder that has subfolders
        folderIds.forEach(folderId => {
            removeFolderInListViewStore(folderId);
        });
    }
);
