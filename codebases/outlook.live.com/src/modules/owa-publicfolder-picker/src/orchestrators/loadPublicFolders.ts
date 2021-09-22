import { orchestrator } from 'satcheljs';
import findPublicFolders from '../services/findPublicFolders';
import {
    loadPublicFolder,
    processFindFolderResponse,
    loadFirstLevelPublicFolders,
} from '../actions/loadPublicFolders';
import {
    publicFolderPickerController,
    shouldShowPublicFolderErrorDialog,
} from '../actions/updatePublicFolderPickerProps';
import getPublicFolderFromFolderId from '../selectors/getPublicFolderFromFolderId';

orchestrator(loadPublicFolder, async actionMessage => {
    const parentFolder = getPublicFolderFromFolderId(actionMessage.folderId);
    if (parentFolder.childFolderIds.length == 0) {
        const findPublicFolderResponse = await findPublicFolders(actionMessage.folderId);
        processFindFolderResponse(findPublicFolderResponse);
    }
});

orchestrator(loadFirstLevelPublicFolders, async actionMessage => {
    const findPublicFolderResponse = await findPublicFolders(actionMessage.folderId);
    if (findPublicFolderResponse) {
        processFindFolderResponse(findPublicFolderResponse);
        publicFolderPickerController(true);
    } else {
        shouldShowPublicFolderErrorDialog(true);
    }
});
