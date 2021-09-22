import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import type { TableView } from 'owa-mail-list-store';

export function hasSenderImageOffInFullView(tableView: TableView) {
    const folderId = tableView?.tableQuery?.folderId;
    const folderName = folderId ? folderIdToName(folderId) : '';
    return folderName === 'drafts' || folderName === 'sentitems';
}
