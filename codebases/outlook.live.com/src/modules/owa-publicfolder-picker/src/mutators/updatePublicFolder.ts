import { mutator } from 'satcheljs';
import {
    addChildFolderIdToParentFolder,
    togglePublicFolderNodeExpansion,
} from '../actions/updatePublicFolder';
import type { PublicFolder } from '../store/publicFolderTable';

mutator(addChildFolderIdToParentFolder, actionMessage => {
    const parentFolder: PublicFolder = actionMessage.parentFolder;
    parentFolder.childFolderIds.push(actionMessage.childFolderId);
});

mutator(togglePublicFolderNodeExpansion, actionMessage => {
    const folder: PublicFolder = actionMessage.folder;
    folder.isExpanded = !folder.isExpanded;
});
