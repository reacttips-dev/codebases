import { getFolderIdForSelectedNode } from 'owa-mail-folder-forest-store';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';

export const customRestriction = (
    customRestrictionFunction: (selectedFolderDistinguishedId?: string) => boolean
) => () => {
    const selectedFolderId = getFolderIdForSelectedNode();
    const selectedFolderDistinguishedId = selectedFolderId && folderIdToName(selectedFolderId);
    return customRestrictionFunction(selectedFolderDistinguishedId);
};
