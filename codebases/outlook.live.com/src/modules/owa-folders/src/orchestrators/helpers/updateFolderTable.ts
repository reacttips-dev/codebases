import { addFoldersToFolderTableMutator } from '../../mutators/addFoldersToFolderTableMutator';
import type { MailFolder } from 'owa-graph-schema';
import type * as Schema from 'owa-graph-schema';
import { updateFolderInformation } from '../../mutators/updateFolderInformation';
import { shouldShowFolder } from 'owa-folders-data-utils';

export function updateFolderTable(
    displayName: string,
    rootFolder: Schema.MailFolder,
    allFolders: Schema.MailFolder[],
    createOrGetFolder_0: (folder: Schema.MailFolder) => MailFolder
) {
    const folders: { [id: string]: MailFolder } = {};

    // Convert root folder to mobx type
    const root = (folders[rootFolder.FolderId.Id] = createOrGetFolder_0(rootFolder));

    // Convert all folders to mobx type
    const folderIds: string[] = [];
    for (let i = 0; i < allFolders.length; i++) {
        const rawFolder = allFolders[i];
        const folderId = rawFolder.FolderId.Id;
        const distinguishedFolderIdName = rawFolder.DistinguishedFolderId;
        if (shouldShowFolder(distinguishedFolderIdName)) {
            folders[folderId] = createOrGetFolder_0(rawFolder);
            folderIds.push(folderId);
        }
    }

    updateFolderInformation(root, displayName, folders, folderIds);

    // Store folders in folder table
    addFoldersToFolderTableMutator(folders);
}
