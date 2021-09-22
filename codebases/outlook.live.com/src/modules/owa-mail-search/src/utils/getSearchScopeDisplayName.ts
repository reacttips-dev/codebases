import {
    allFoldersInArchive,
    allFoldersString,
} from 'owa-locstrings/lib/strings/getSearchScopeDisplayName.locstring.json';
import { lazyGetGroupDisplayName } from 'owa-group-utils';
import loc from 'owa-localize';
import { allFolders } from 'owa-locstrings/lib/strings/allfolders.locstring.json';
import {
    SearchScope,
    SearchScopeKind,
    SingleGroupSearchScope,
    SharedFoldersSearchScope,
    ArchiveMailboxSearchScope,
    PrimaryMailboxSearchScope,
    PublicFolderSearchScope,
} from 'owa-search-service';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import folderStore, { getEffectiveFolderDisplayName } from 'owa-folders';
import {
    ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID,
    PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import publicFolderFavoriteStore from 'owa-public-folder-favorite/lib/store/publicFolderFavoriteStore';

export type FoldersSearchScope =
    | SharedFoldersSearchScope
    | ArchiveMailboxSearchScope
    | PrimaryMailboxSearchScope
    | PublicFolderSearchScope;

export default function getSearchScopeDisplayName(
    scope: SearchScope,
    isSearchFromFolderScope?: boolean
) {
    switch (scope.kind) {
        case SearchScopeKind.PrimaryMailbox:
        case SearchScopeKind.ArchiveMailbox:
        case SearchScopeKind.SharedFolders:
        case SearchScopeKind.PublicFolder:
            return getMailboxSearchScopeDisplayName(scope, isSearchFromFolderScope);
        case SearchScopeKind.Group:
            return getSingleGroupSearchScopeDisplayName(scope);
        default:
            throw new Error('Unregistered search scope');
    }
}

export function getMailboxSearchScopeDisplayName(
    folderSearchScope: FoldersSearchScope,
    isSearchFromFolderScope?: boolean
): string {
    if (!folderSearchScope.folderId) {
        return '';
    }

    const folderName = folderIdToName(folderSearchScope.folderId);
    if (folderName === PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID && isSearchFromFolderScope) {
        return loc(allFoldersString);
    } else if (folderName === PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID) {
        return loc(allFolders);
    } else if (folderName === ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID) {
        return loc(allFoldersInArchive);
    } else {
        let folder = folderStore.folderTable.get(folderSearchScope.folderId);
        if (folderSearchScope.kind === SearchScopeKind.PublicFolder) {
            folder = publicFolderFavoriteStore.folderTable.get(folderSearchScope.folderId);
        }

        return getEffectiveFolderDisplayName(folder);
    }
}

export function getSingleGroupSearchScopeDisplayName(
    singleGroupSearchScope: SingleGroupSearchScope
): string {
    const getGroupDisplayName = lazyGetGroupDisplayName.tryImportForRender();
    if (getGroupDisplayName) {
        return lazyGetGroupDisplayName.tryImportForRender()(singleGroupSearchScope.groupId);
    }

    return singleGroupSearchScope.groupId;
}
