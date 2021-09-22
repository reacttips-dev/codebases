import type SearchTableQuery from '../store/schema/SearchTableQuery';
import {
    ARCHIVE_DUMPSTER_DISTINGUISHED_ID,
    PRIMARY_DUMPSTER_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import type { TableQuery } from 'owa-mail-list-store';
import { isFolderUnderArchiveRoot } from 'owa-mail-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import {
    primaryMailboxSearchScope,
    archiveMailboxSearchScope,
    SearchScopeKind,
} from 'owa-search-service/lib/data/schema/SearchScope';
import compareSearchScope from 'owa-search-service/lib/helpers/searchScope/compareSearchScope';

/**
 * Returns a boolean indicating whether the table is the dumpster search table.
 */
export default function isDumpsterSearchTable(tableQuery: TableQuery | undefined): boolean {
    if (!tableQuery) {
        return false;
    }
    const searchTableQuery = tableQuery as SearchTableQuery;
    return isFolderUnderArchiveRoot(searchTableQuery.folderId)
        ? compareSearchScope(
              searchTableQuery.searchScope,
              archiveMailboxSearchScope({
                  folderId: folderNameToId(ARCHIVE_DUMPSTER_DISTINGUISHED_ID),
                  kind: SearchScopeKind.ArchiveMailbox,
              })
          )
        : compareSearchScope(
              searchTableQuery.searchScope,
              primaryMailboxSearchScope({
                  folderId: folderNameToId(PRIMARY_DUMPSTER_DISTINGUISHED_ID),
                  kind: SearchScopeKind.PrimaryMailbox,
              })
          );
}
