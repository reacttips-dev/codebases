import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import {
    primaryMailboxSearchScope,
    archiveMailboxSearchScope,
    SearchScope,
    SearchScopeKind,
} from '../../data/schema/SearchScope';
import {
    PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID,
    ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID,
    ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID,
} from 'owa-folders-constants';
import { getMailRootFolderChildIds } from 'owa-folders/lib/util/folderUtility';

export function getPrimaryMailboxSearchScopeList(): SearchScope[] {
    const searchScopes: SearchScope[] = [];

    // Add some distinguished folders and a root folder
    searchScopes.push(
        primaryMailboxSearchScope({
            folderId: folderNameToId(PRIMARY_FOLDER_ROOT_DISTINGUISHED_ID),
            kind: SearchScopeKind.PrimaryMailbox,
        })
    );

    const folderIds = getMailRootFolderChildIds('UserMailbox');

    for (let folderId of folderIds) {
        searchScopes.push(
            primaryMailboxSearchScope({
                folderId: folderId,
                kind: SearchScopeKind.PrimaryMailbox,
            })
        );
    }

    return searchScopes;
}

export function getArchiveMailboxSearchScopeList(): SearchScope[] {
    const searchScopes: SearchScope[] = [];

    // Add some distinguished folders and archive root folder
    searchScopes.push(
        archiveMailboxSearchScope({
            folderId: folderNameToId(ARCHIVE_FOLDER_ROOT_DISTINGUISHED_ID),
            kind: SearchScopeKind.ArchiveMailbox,
        })
    );
    searchScopes.push(
        archiveMailboxSearchScope({
            folderId: folderNameToId(ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID),
            kind: SearchScopeKind.ArchiveMailbox,
        })
    );
    return searchScopes;
}

export function getSharedFoldersScopeList(): SearchScope[] {
    return [];
}

export function getGroupSearchScopeList(): SearchScope[] {
    return [];
}

export function getCalendarSearchScopeList(): SearchScope[] {
    return [];
}

export function getPublicFolderSearchScopeList(): SearchScope[] {
    return [];
}
