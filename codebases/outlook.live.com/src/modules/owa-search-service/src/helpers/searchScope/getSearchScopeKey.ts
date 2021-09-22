import type {
    PrimaryMailboxSearchScope,
    ArchiveMailboxSearchScope,
    SharedFoldersSearchScope,
    SingleGroupSearchScope,
    CalendarSearchScope,
    PublicFolderSearchScope,
} from '../../data/schema/SearchScope';

export function getPrimaryMailboxSearchScopeKey(
    primaryMailboxSearchScope: PrimaryMailboxSearchScope
): string {
    return primaryMailboxSearchScope.kind + '-' + primaryMailboxSearchScope.folderId; // Folder Ids are case sensitive.
}

export function getArchiveMailboxSearchScopeKey(
    archiveMailboxSearchScope: ArchiveMailboxSearchScope
): string {
    return archiveMailboxSearchScope.kind + '-' + archiveMailboxSearchScope.folderId; // Folder Ids are case sensitive.
}

/**
 * Helper to return the search scope key of shared folders
 * @param sharedFoldersSearchScope
 */
export function getSharedFoldersSearchScopeKey(
    sharedFoldersSearchScope: SharedFoldersSearchScope
): string {
    return sharedFoldersSearchScope.kind + '-' + sharedFoldersSearchScope.folderId; // Folder Ids are case sensitive.
}

export function getSingleGroupSearchScopeKey(
    singleGroupSearchScope: SingleGroupSearchScope
): string {
    return singleGroupSearchScope.kind + '-' + singleGroupSearchScope.groupId.toLowerCase(); // Group Ids are SMTP addresses and shouldn't be case sensitive.
}

export function getCalendarSearchScopeKey(calendarSearchScope: CalendarSearchScope): string {
    return calendarSearchScope.kind + '-' + calendarSearchScope.calendarFolderId
        ? calendarSearchScope.calendarFolderId.toLowerCase()
        : '';
}

export function getPublicFolderSearchScopeKey(
    publicFolderSearchScope: PublicFolderSearchScope
): string {
    return publicFolderSearchScope.kind + '-' + publicFolderSearchScope.folderId;
}
