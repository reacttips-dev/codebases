import type {
    PrimaryMailboxSearchScope,
    ArchiveMailboxSearchScope,
    SharedFoldersSearchScope,
    SingleGroupSearchScope,
    CalendarSearchScope,
    PublicFolderSearchScope,
} from '../../data/schema/SearchScope';
import type BaseSearchScopeType from 'owa-service/lib/contract/BaseSearchScopeType';
import UnifiedGroupIdentityType from 'owa-service/lib/contract/UnifiedGroupIdentityType';
import distinguishedFolderId from 'owa-service/lib/factory/distinguishedFolderId';
import folderId from 'owa-service/lib/factory/folderId';
import primaryMailboxSearchScopeType from 'owa-service/lib/factory/primaryMailboxSearchScopeType';
import largeArchiveSearchScopeType from 'owa-service/lib/factory/largeArchiveSearchScopeType';
import SearchScopeArchives from 'owa-service/lib/contract/SearchScopeArchives';
import singleLargeArchiveSearchScopeType from 'owa-service/lib/factory/singleLargeArchiveSearchScopeType';
import searchFolderScopeType from 'owa-service/lib/factory/searchFolderScopeType';
import singleGroupSearchScopeType from 'owa-service/lib/factory/singleGroupSearchScopeType';
import unifiedGroupIdentity from 'owa-service/lib/factory/unifiedGroupIdentity';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';

export function getPrimaryMailboxSearchScopeType(
    primaryMailboxSearchScope: PrimaryMailboxSearchScope
): BaseSearchScopeType[] {
    const distinguishedFolder = folderIdToName(primaryMailboxSearchScope.folderId);
    let folderScopeId;
    if (distinguishedFolder != 'none') {
        folderScopeId = distinguishedFolderId({
            Id: distinguishedFolder,
        });
    } else {
        folderScopeId = folderId({
            Id: primaryMailboxSearchScope.folderId,
        });
    }

    return [
        primaryMailboxSearchScopeType({
            FolderScope: searchFolderScopeType({
                BaseFolderId: folderScopeId,
            }),
            IsDeepTraversal: true,
        }),
    ];
}

export function getArchiveMailboxSearchScopeType(
    archiveMailboxSearchScope: ArchiveMailboxSearchScope
): BaseSearchScopeType[] {
    const distinguishedFolder = folderIdToName(archiveMailboxSearchScope.folderId);
    let folderScopeId;
    if (distinguishedFolder != 'none') {
        folderScopeId = distinguishedFolderId({
            Id: distinguishedFolder,
        });
    } else {
        folderScopeId = folderId({
            Id: archiveMailboxSearchScope.folderId,
        });
    }

    if (distinguishedFolder == 'archivemsgfolderroot') {
        return [largeArchiveSearchScopeType({ ArchiveTypes: SearchScopeArchives.All })];
    } else {
        return [
            singleLargeArchiveSearchScopeType({
                FolderScope: searchFolderScopeType({
                    BaseFolderId: folderScopeId,
                }),
            }),
        ];
    }
}

/**
 * Helper to return the search scope type of shared folders
 * @param sharedFoldersSearchScope
 */
export function getSharedFoldersSearchScopeType(
    sharedFoldersSearchScope: SharedFoldersSearchScope
): BaseSearchScopeType[] {
    // Currently, we don't have the search scope utility for shared folders in owa-service unlike primary and archive mailbox
    return null;
}

/**
 * Helper to return the search scope type of public folders
 * @param publicFolderSearchScope
 */
export function getPublicFolderSearchScopeType(
    publicFolderSearchScope: PublicFolderSearchScope
): BaseSearchScopeType[] {
    return null;
}

export function getSingleGroupSearchScopeType(
    singleGroupSearchScope: SingleGroupSearchScope
): BaseSearchScopeType[] {
    return [
        singleGroupSearchScopeType({
            GroupIdentity: unifiedGroupIdentity({
                Type: UnifiedGroupIdentityType.SmtpAddress,
                Value: singleGroupSearchScope.groupId,
            }),
        }),
    ];
}

export function getCalendarSearchScopeType(
    calendarSearchScope: CalendarSearchScope
): BaseSearchScopeType[] {
    return null;
}
