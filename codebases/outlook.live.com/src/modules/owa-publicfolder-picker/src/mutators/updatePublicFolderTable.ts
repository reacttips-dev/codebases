import { mutator } from 'satcheljs';
import publicFolderTable, { PublicFolder } from '../store/publicFolderTable';
import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';
import {
    addFolderToPublicFolderTable,
    addRootFolderToPublicFolderTable,
    clearPublicFolderTable,
} from '../actions/updatePublicFolderTable';
import { mapOWSFolderToGql, getSourceWellKnownFolderTypeProperty } from 'owa-folder-gql-mappers';

// fixes the FolderClass value of a Public Folder.
// see https://outlookweb.visualstudio.com/Outlook%20Web/_queries/edit/59817/
function getPublicFolderClass(item: BaseFolderType): string {
    if (!item.FolderClass) {
        // fallback to IPF.Note if FolderClass is missing
        return 'IPF.Note';
    }

    switch (item.FolderClass.toLowerCase()) {
        case 'ipf.note':
            return 'IPF.Note';
        case 'ipf.appointment':
            return 'IPF.Appointment';
        case 'ipf.contact':
            return 'IPF.Contact';
        default:
            return item.FolderClass;
    }
}

mutator(addFolderToPublicFolderTable, actionMessage => {
    const item: BaseFolderType = actionMessage.item;
    const folderId = item.FolderId.Id;
    const folder: PublicFolder = {
        ...mapOWSFolderToGql(item, actionMessage.mailboxInfo),
        isExpanded: false,
        childFolderIds: [],
        sourceWellKnownFolderType: getSourceWellKnownFolderTypeProperty(item),
        FolderClass: getPublicFolderClass(item),
        ChildFolderCount: item.ChildFolderCount,
    };

    publicFolderTable.folderTable.set(folderId, folder);
});

mutator(addRootFolderToPublicFolderTable, actionMessage => {
    const rootFolder: PublicFolder = actionMessage.rootFolder;
    publicFolderTable.rootFolder = rootFolder;
    publicFolderTable.rootFolder.mailboxInfo = actionMessage.mailboxInfo;
});

mutator(clearPublicFolderTable, actionMessage => {
    publicFolderTable.folderTable.clear();
    publicFolderTable.rootFolder = null;
});
