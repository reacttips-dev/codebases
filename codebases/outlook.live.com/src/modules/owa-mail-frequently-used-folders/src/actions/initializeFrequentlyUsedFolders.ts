import saveFrequentlyUsedFolders from '../services/saveFrequentlyUsedFolders';
import { getStore } from '../store/store';
import type { FrequentlyUsedFolder } from 'owa-mail-store';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { trace } from 'owa-trace';
import { action } from 'satcheljs/lib/legacy';
import { getFolderTable } from 'owa-folders';

// Initialize store with frequently used folder list from user configuration
export default action('initializeFrequentlyUsedFolders')(
    function initializeFrequentlyUsedFolders() {
        const userOptions = getUserConfiguration().UserOptions;
        let isCorrupted = false;
        const store = getStore();

        if (store.isInitialized) {
            return;
        }

        if (userOptions.FrequentlyUsedFolders) {
            userOptions.FrequentlyUsedFolders.forEach(folder => {
                try {
                    const parsedFolder: FrequentlyUsedFolder = JSON.parse(folder);
                    // If folder is not part of the Folder Table, dont add to the FUF list
                    // and mark as corrupted so we update the list on the server
                    if (getFolderTable().get(parsedFolder.FolderId)) {
                        store.frequentlyUsedFolders.push(parsedFolder);
                    } else {
                        isCorrupted = true;
                    }
                } catch (ex) {
                    trace.warn('Unable to parse frequently used folders');
                    isCorrupted = true;
                }
            });
        }

        store.isInitialized = true;

        // save back the list which excludes corrupted folders
        if (isCorrupted) {
            saveFrequentlyUsedFolders();
        }
    }
);
