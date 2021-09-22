import {
    primaryMailboxSearchScope,
    archiveMailboxSearchScope,
    SearchScopeKind,
} from 'owa-search-service';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import {
    PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
    ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID,
} from 'owa-folders-constants';

export default function getDefaultMailBoxScope(searchScopeKind) {
    // Change scope to "All folders".
    let defaultMailboxScope;

    if (searchScopeKind == SearchScopeKind.PrimaryMailbox) {
        defaultMailboxScope = primaryMailboxSearchScope({
            folderId: folderNameToId(PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID),
            kind: SearchScopeKind.PrimaryMailbox,
        });
    } else if (searchScopeKind == SearchScopeKind.ArchiveMailbox) {
        defaultMailboxScope = archiveMailboxSearchScope({
            folderId: folderNameToId(ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID),
            kind: SearchScopeKind.ArchiveMailbox,
        });
    }
    return defaultMailboxScope;
}
