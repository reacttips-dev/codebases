import { SearchScope, SingleGroupSearchScope, SearchScopeKind } from 'owa-search-service';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getListViewTypeForFolder } from 'owa-mail-folder-store';
import type { FoldersSearchScope } from './getSearchScopeDisplayName';

export default function getSearchScopeListViewType(scope: SearchScope) {
    switch (scope.kind) {
        case SearchScopeKind.PrimaryMailbox:
        case SearchScopeKind.ArchiveMailbox:
        case SearchScopeKind.SharedFolders:
            return getMailboxSearchScopeListViewType(scope);
        // Message View is used for Public Folders
        case SearchScopeKind.PublicFolder:
            return ReactListViewType.Message;
        case SearchScopeKind.Group:
            return getSingleGroupSearchScopeListViewType(scope);
        default:
            throw new Error('Unregistered search scope');
    }
}

function getMailboxSearchScopeListViewType(
    folderSearchScope: FoldersSearchScope
): ReactListViewType {
    return getListViewTypeForFolder(folderSearchScope.folderId);
}

export function getSingleGroupSearchScopeListViewType(
    singleGroupSearchScope: SingleGroupSearchScope
): ReactListViewType {
    return ReactListViewType.Conversation;
}
