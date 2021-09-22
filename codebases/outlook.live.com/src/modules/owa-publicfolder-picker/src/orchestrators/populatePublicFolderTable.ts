import { errorCantLoadPublicFolderListText } from './populatePublicFolderTable.locstring.json';
import loc from 'owa-localize';
import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';
import type FolderId from 'owa-service/lib/contract/FolderId';
import getPublicFolderFromFolderId from '../selectors/getPublicFolderFromFolderId';
import {
    addFolderToPublicFolderTable,
    addRootFolderToPublicFolderTable,
} from '../actions/updatePublicFolderTable';
import getRootPublicFolder from '../selectors/getRootPublicFolder';
import { orchestrator } from 'satcheljs';
import { addChildFolderIdToParentFolder } from '../actions/updatePublicFolder';
import { processFindFolderResponse } from '../actions/loadPublicFolders';
import { updateResponseMessageInPicker } from '../actions/updatePublicFolderPickerProps';
import type { FindPublicFolderResponseMessage } from '../services/findPublicFolders';

// VSTS 23155: Refactor load folders to not have pass by reference pattern
export default orchestrator(processFindFolderResponse, actionMessage => {
    const publicFolderResponseMessage: FindPublicFolderResponseMessage =
        actionMessage.responseMessage;

    if (!publicFolderResponseMessage) {
        updateResponseMessageInPicker(loc(errorCantLoadPublicFolderListText), true);
        return;
    }

    const responseMessage = publicFolderResponseMessage.findFolderResponseMessage;
    const publicFolderMailboxInfo = publicFolderResponseMessage.mailboxInfo;
    const folderIds: FolderId[] = [];

    // process all of the folders in the response
    responseMessage.RootFolder.Folders.forEach((item: BaseFolderType) => {
        addFolderToPublicFolderTable(item, publicFolderMailboxInfo);
        folderIds.push(item.FolderId);
    });

    // process the ParentFolder from the response, and set it as the root
    if (!getRootPublicFolder()) {
        addFolderToPublicFolderTable(
            responseMessage.RootFolder.ParentFolder,
            publicFolderMailboxInfo
        );
        addRootFolderToPublicFolderTable(
            getPublicFolderFromFolderId(responseMessage.RootFolder.ParentFolder.FolderId.Id),
            publicFolderMailboxInfo
        );
    }

    // set up all of the parent-child folder relations
    folderIds.forEach((folderId: FolderId) => {
        const folder = getPublicFolderFromFolderId(folderId.Id);
        const parentFolder = getPublicFolderFromFolderId(folder.ParentFolderId.Id);

        if (parentFolder) {
            addChildFolderIdToParentFolder(parentFolder, folderId.Id);
        }
    });
});
