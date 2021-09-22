import type SearchTableQuery from '../store/schema/SearchTableQuery';
import {
    PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID,
    ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID,
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
 * Returns a boolean indicating whether the table is the deleted items search table.
 */
export default function isDeletedItemsSearchTable(tableQuery: TableQuery): boolean {
    const searchTableQuery = tableQuery as SearchTableQuery;
    return isFolderUnderArchiveRoot(searchTableQuery.folderId)
        ? compareSearchScope(
              searchTableQuery.searchScope,
              archiveMailboxSearchScope({
                  folderId: folderNameToId(ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID),
                  kind: SearchScopeKind.ArchiveMailbox,
              })
          )
        : compareSearchScope(
              searchTableQuery.searchScope,
              primaryMailboxSearchScope({
                  folderId: folderNameToId(PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID),
                  kind: SearchScopeKind.PrimaryMailbox,
              })
          );
}
