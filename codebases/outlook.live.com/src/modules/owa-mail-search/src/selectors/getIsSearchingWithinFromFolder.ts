import { getStore } from '../store/store';
import { SearchScope, SearchScopeKind } from 'owa-search-service';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';

/**
 * Determines whether or not user is searching within a folder where it's more
 * common to use a "from:" prefix when searching for people.
 */
export default function getIsSearchingWithinFromFolder(searchScope?: SearchScope): boolean {
    if (!searchScope) {
        searchScope = getStore().staticSearchScope;
    }

    let folderScopeName: DistinguishedFolderIdName = 'none';
    if (searchScope.kind === SearchScopeKind.PrimaryMailbox) {
        folderScopeName = folderIdToName(searchScope.folderId);
    }

    switch (folderScopeName) {
        case 'sentitems':
        case 'drafts':
            return false;
    }

    return true;
}
