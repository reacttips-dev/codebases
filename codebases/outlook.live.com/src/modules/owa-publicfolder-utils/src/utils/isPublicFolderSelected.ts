import { getSelectedTableView, TableQueryType } from 'owa-mail-list-store';
import { isPublicFolder } from 'owa-folders';

/**
 * Checks if selected row in left nav is public folder
 */
export function isPublicFolderSelected(): boolean {
    const selectedTable = getSelectedTableView();
    return (
        selectedTable &&
        selectedTable.tableQuery.type == TableQueryType.Folder &&
        isPublicFolder(selectedTable.tableQuery.folderId)
    );
}

/**
 * Gets folderId from a specified row in left nav
 */
export function getSelectedPublicFolderId(): string {
    const tableView = getSelectedTableView();
    return tableView &&
        tableView.tableQuery.type == TableQueryType.Folder &&
        isPublicFolder(tableView.tableQuery.folderId)
        ? tableView.tableQuery.folderId
        : null;
}
