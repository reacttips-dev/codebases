import { getSelectedTableView } from 'owa-mail-list-store';
import { SearchScopeKind } from 'owa-search-service';
import type { SearchTableQuery } from 'owa-mail-list-search';
import { isFolderInMailboxType } from 'owa-folders';

/**
 * Determine if the ongoing search is for a shared folder
 * @returns boolean
 */
export default function isSharedFolderSearch(): boolean {
    const searchTableQuery = getSelectedTableView().tableQuery as SearchTableQuery;
    if (searchTableQuery.searchScope) {
        return searchTableQuery.searchScope.kind === SearchScopeKind.SharedFolders;
    } else {
        // Until user performs a search the searchScope does not get set. So, we need this fallback check
        const { folderId } = searchTableQuery;
        return folderId && isFolderInMailboxType(folderId, 'SharedMailbox');
    }
}
