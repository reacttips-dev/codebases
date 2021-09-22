import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { xor } from './utils/xor';
import { getSelectedTableView, TableView } from 'owa-mail-list-store';

export const folderRestriction = (restrictedFolders: string[], shouldHide?: boolean) => () => {
    // Check if we are in the right folder.
    const tableView: TableView = getSelectedTableView();
    const selectedFolderId = tableView && tableView.tableQuery.folderId;

    // If we are not in inbox focusedViewFilter restriction does not apply
    const selectedFolderDistinguishedId = selectedFolderId && folderIdToName(selectedFolderId);
    const isFolderInRestrictionList = restrictedFolders.includes(selectedFolderDistinguishedId);

    return xor(shouldHide, isFolderInRestrictionList);
};
