import type { SearchTableQuery } from 'owa-mail-list-search';
import type { FoldersSearchScope } from './getSearchScopeDisplayName';
import { TableQuery, TableQueryType, TableView } from 'owa-mail-list-store';
import { SearchScopeKind } from 'owa-search-service';

/**
 * @param tableQuery table Query
 */
function isFolderSearch(tableQuery: TableQuery): boolean {
    if (tableQuery.type != TableQueryType.Search) {
        return false;
    }

    const currentSearchScope = (tableQuery as SearchTableQuery).searchScope;
    const foldersSearchScopeKinds = [
        SearchScopeKind.PrimaryMailbox,
        SearchScopeKind.ArchiveMailbox,
        SearchScopeKind.SharedFolders,
    ];
    // Return true only if the table query's search scope type
    // is either primary mailbox or archive mailbox or shared folders
    return foldersSearchScopeKinds.indexOf(currentSearchScope.kind) > -1;
}

/**
 * @param tableView table View
 * @returns folderId based on the type and search scope of the table query
 */
export default function getFolderIdFromTableView(tableView: TableView) {
    const tableQuery = tableView.tableQuery;
    if (tableQuery.type === TableQueryType.Folder) {
        return tableQuery.folderId;
    } else if (isFolderSearch(tableQuery)) {
        const folderSearchScope = (tableQuery as SearchTableQuery)
            .searchScope as FoldersSearchScope;
        return folderSearchScope.folderId;
    }

    return null;
}
