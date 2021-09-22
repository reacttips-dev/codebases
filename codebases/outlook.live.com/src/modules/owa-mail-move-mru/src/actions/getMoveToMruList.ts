import getFolderMruConfigurationService from '../services/getFolderMruConfigurationService';
import store from '../store/store';
import type TargetFolderMruConfiguration from 'owa-service/lib/contract/TargetFolderMruConfiguration';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { action } from 'satcheljs/lib/legacy';

/**
 * Action to get Move to Mru list
 */
export default action('getMoveToMruList')(function getMoveToMruList() {
    if (!store.isInitialized) {
        getFolderMruConfigurationService().then(response => processResponse(response));
    }
});

// Process TargetFolderMruConfiguration
function processResponse(response: TargetFolderMruConfiguration) {
    if (response.FolderMruEntries == null || response.FolderMruEntries.length == 0) {
        store.mruFolders.push(folderNameToId('inbox'));
        store.mruFolders.push(folderNameToId('deleteditems'));
        store.mruFolders.push(folderNameToId('archive'));
    } else {
        for (let i = 0; i < response.FolderMruEntries.length; i++) {
            const folderId = response.FolderMruEntries[i].EwsFolderIdEntry;
            store.mruFolders.push(folderId);
        }
    }

    store.isInitialized = true;
}
