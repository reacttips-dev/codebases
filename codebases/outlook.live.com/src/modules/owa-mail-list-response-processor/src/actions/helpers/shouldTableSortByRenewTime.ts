import { isGroupTableQuery } from 'owa-group-utils';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import {
    MailFolderTableQuery,
    MailSortHelper,
    TableQuery,
    TableQueryType,
} from 'owa-mail-list-store';

export function shouldFolderSortByRenewTime(folderId: string): boolean {
    // Folder id should not be null if not in search mode
    if (!folderId) {
        throw new Error('Current folder id should not be null');
    }

    return (
        folderNameToId('sentitems') != folderId &&
        folderNameToId('deleteditems') != folderId &&
        folderNameToId('drafts') != folderId &&
        folderNameToId('junkemail') != folderId &&
        folderNameToId('archive') != folderId
    );
}

export default function shouldTableSortByRenewTime(tableQuery: TableQuery) {
    if (isGroupTableQuery(tableQuery)) {
        return false;
    }

    if (tableQuery.type == TableQueryType.Folder) {
        const tableSortby = (tableQuery as MailFolderTableQuery).sortBy;
        const renewTimeSort = MailSortHelper.getSortBySupportingPin();
        return (
            tableSortby.sortColumn == renewTimeSort.sortColumn &&
            tableSortby.sortDirection == renewTimeSort.sortDirection &&
            shouldFolderSortByRenewTime(tableQuery.folderId)
        );
    } else {
        return tableQuery.type == TableQueryType.Search;
    }
}
