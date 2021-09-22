export const enum SearchScopeKind {
    PrimaryMailbox = 'PrimaryMailbox',
    ArchiveMailbox = 'ArchiveMailbox',
    SharedFolders = 'SharedFolders',
    Group = 'Group',
    Calendar = 'Calendar',
    PublicFolder = 'PublicFolder',
}

export interface PrimaryMailboxSearchScope {
    kind: SearchScopeKind.PrimaryMailbox;
    folderId: string;
}

export interface ArchiveMailboxSearchScope {
    kind: SearchScopeKind.ArchiveMailbox;
    folderId: string;
}

export interface SharedFoldersSearchScope {
    kind: SearchScopeKind.SharedFolders;
    folderId: string;
}

export interface SingleGroupSearchScope {
    kind: SearchScopeKind.Group;
    groupId: string;
}

export interface CalendarSearchScope {
    kind: SearchScopeKind.Calendar;
    calendarFolderId?: string;
}

export interface PublicFolderSearchScope {
    kind: SearchScopeKind.PublicFolder;
    folderId: string;
}

export function primaryMailboxSearchScope(
    data: PrimaryMailboxSearchScope
): PrimaryMailboxSearchScope {
    return { ...data };
}

export function archiveMailboxSearchScope(
    data: ArchiveMailboxSearchScope
): ArchiveMailboxSearchScope {
    return { ...data };
}

export function sharedFoldersSearchScope(data: SharedFoldersSearchScope): SharedFoldersSearchScope {
    return { ...data };
}

export function singleGroupSearchScope(data: SingleGroupSearchScope): SingleGroupSearchScope {
    return { ...data };
}

export function calendarSearchScope(data: CalendarSearchScope): CalendarSearchScope {
    return { ...data };
}

export function publicFolderSearchScope(data: PublicFolderSearchScope): PublicFolderSearchScope {
    return { ...data };
}

export type SearchScope =
    | PrimaryMailboxSearchScope
    | ArchiveMailboxSearchScope
    | SharedFoldersSearchScope
    | SingleGroupSearchScope
    | CalendarSearchScope
    | PublicFolderSearchScope;
