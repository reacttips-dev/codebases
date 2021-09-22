import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import {
    SearchScope,
    PrimaryMailboxSearchScope,
    ArchiveMailboxSearchScope,
    getKey,
    SearchScopeKind,
} from 'owa-search-service';

/**
 * Logic to determine the folder name from the search scope.
 */
export default function getFolderNameFromScope(searchScope: SearchScope) {
    let folderName: string = null;
    switch (searchScope.kind) {
        case SearchScopeKind.PrimaryMailbox:
        case SearchScopeKind.ArchiveMailbox:
            folderName = folderIdToName(
                (searchScope as ArchiveMailboxSearchScope | PrimaryMailboxSearchScope).folderId
            );
            break;
        case SearchScopeKind.Group:
            folderName = null; // TODO 112086: Add the key back once we know how to log PII data.
            break;
        default:
            folderName = getKey(searchScope);
            break;
    }
    return folderName;
}
