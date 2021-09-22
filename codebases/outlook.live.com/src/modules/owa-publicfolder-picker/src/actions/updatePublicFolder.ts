import { action } from 'satcheljs';
import type { PublicFolder } from '../store/publicFolderTable';

export let addChildFolderIdToParentFolder = action(
    'addChildFolderIdToParentFolder',
    (parentFolder: PublicFolder, childFolderId: string) => {
        return {
            parentFolder,
            childFolderId,
        };
    }
);

export let togglePublicFolderNodeExpansion = action(
    'togglePublicFolderNodeExpansion',
    (folder: PublicFolder) => {
        return {
            folder,
        };
    }
);
