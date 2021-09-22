import { mutatorAction } from 'satcheljs';
import type { MailFolder } from 'owa-graph-schema';
import getFolderTable from '../selectors/getFolderTable';

// We are using a mutator action because when we retrieve folders from the folder table to update the folder information(DisplayName, childrenFolderIds), we are changing
// stored observable values.
export const updateFolderInformation = mutatorAction(
    'updateFolder',
    (
        folder: MailFolder,
        displayName: string,
        folders: { [id: string]: MailFolder },
        folderIds: string[]
    ) => {
        if (displayName) {
            folder.DisplayName = displayName; // The passed in folder, if it existed in the table, is a mobx observable.
        }

        folderIds.forEach(folderId => {
            const folder = folders[folderId];
            // Parent maybe already fetched and did not come as part of this request, so get from store
            const parent =
                folders[folder.ParentFolderId.Id] || getFolderTable().get(folder.ParentFolderId.Id); // The folder retreived from getFolderTable is an observable.
            if (parent && parent.childFolderIds.indexOf(folderId) == -1) {
                parent.childFolderIds.push(folderId);
            }
        });
    }
);
