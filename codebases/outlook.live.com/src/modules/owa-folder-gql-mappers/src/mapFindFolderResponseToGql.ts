import type * as Schema from 'owa-graph-schema';
import getRemoteFolderDisplayNameProperty from './getRemoteFolderDisplayNameProperty';
import getIsFolderHiddenProperty from './getIsFolderHiddenProperty';
import getSourceWellKnownFolderTypeProperty from './getSourceWellKnownFolderTypeProperty';
import { getReplicaListProperty } from './getReplicaListProperty';
import type FolderType from 'owa-service/lib/contract/Folder';
import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';
import type RetentionTagType from 'owa-service/lib/contract/RetentionTagType';
import type FolderId from 'owa-service/lib/contract/FolderId';
import type FindFolderResponseMessage from 'owa-service/lib/contract/FindFolderResponseMessage';
import { GEEK_FOLDERS_TO_IGNORE } from 'owa-folders-constants';
import { trace } from 'owa-trace';
import type { MailboxInfo } from 'owa-client-ids';

// Eventually this file should be behind web resolver boundary once other scenarios that
// depend on folders are also migrated

/**
 * Maps the legacy findFolders response to GQL response
 * @param findFolderResponse folder hierarchy response
 * @param mailboxInfo mailboxInfo
 * @param shouldShowJunkEmailFolder whether client supports junk email folder
 * @param shouldShowNotesFolder whether client supports notes folder
 * @param replicaListMap replica list map
 */
export function mapFindFolderResponseToGql(
    findFolderResponse: FindFolderResponseMessage,
    mailboxInfo: Schema.MailboxInfoInput,
    shouldShowJunkEmailFolder: boolean,
    shouldShowNotesFolder: boolean
): Schema.FolderHierarchyResult {
    /**
     * Throw in case response is not successful or expected data is not found
     */
    const rootFolder = findFolderResponse.RootFolder;
    if (!rootFolder || !rootFolder.Folders || !rootFolder.ParentFolder) {
        throw new Error('folderHierarchyWeb: failed to get folders');
    }

    let mailFolders: Schema.MailFolder[] = [];
    rootFolder?.Folders.forEach(folder => {
        // Eliminate folders that client wants to hide or does not support.
        if (
            folder &&
            canAddFolderToFolderResult(folder, shouldShowJunkEmailFolder, shouldShowNotesFolder)
        ) {
            const gqlFolder = mapOWSFolderToGql(folder, mailboxInfo);
            if (gqlFolder) {
                mailFolders.push(gqlFolder);
            }
        }
    });

    const distinguishedFolderId = rootFolder?.ParentFolder?.DistinguishedFolderId || 'none';
    /**
     * Update distinguished folder id name of root folder for shared folder hierarchies
     */
    const rootDistinguishedFolderIdName = getDistinguishedFolderIdNameForRootFolder(
        distinguishedFolderId,
        mailboxInfo.type
    );

    rootFolder.ParentFolder.DistinguishedFolderId = rootDistinguishedFolderIdName;

    let mapRootFolder = mapOWSFolderToGql(rootFolder.ParentFolder, mailboxInfo);

    return {
        __typename: 'FolderHierarchyResult',
        Folders: mailFolders,
        RootFolder: mapRootFolder,
        offset: rootFolder.IndexedPagingOffset,
        TotalItemsInView: rootFolder.TotalItemsInView,
        IncludesLastItemInRange: rootFolder.IncludesLastItemInRange,
    };
}

/**
 * Helper for getting distinguished id folder name for mailbox root
 * @param distinguishedFolderId - distinguishedFolderId
 * @param mailboxType - mailbox type
 */
export function getDistinguishedFolderIdNameForRootFolder(
    distinguishedFolderId: string,
    mailboxType: Schema.MailboxType
): string | undefined {
    // Shared folder roots have distinguishedIdNames as msgFolderRoot which is same as primary mailbox.
    // We should not populate them to avoid confusion at any point of time
    return mailboxType === 'SharedMailbox' ? undefined : distinguishedFolderId;
}

function isOfTypeMailFolder(folderType: string | undefined): boolean {
    return folderType == 'Folder:#Exchange';
}

// Any changes you make here, make sure to add them to similar logic in getFolderStorageInformation
/**
 * Return flag indicating whether folder should be returned
 * @param folder OWS folder type
 * @param shouldShowJunkEmailFolder whether client supports junk email folder
 * @param shouldShowNotesFolder whether client supports notes folder
 */
function canAddFolderToFolderResult(
    folder: BaseFolderType,
    shouldShowJunkEmailFolder: boolean,
    shouldShowNotesFolder: boolean
): boolean {
    // Do not show the folder if it's not a mail folder.
    if (!isOfTypeMailFolder(folder?.__type)) {
        return false;
    }

    // Suppress 'geek' folders (outbox, journal, etc).
    if (
        folder?.DistinguishedFolderId &&
        GEEK_FOLDERS_TO_IGNORE.indexOf(folder.DistinguishedFolderId) >= 0
    ) {
        return false;
    }

    // Eliminate hidden folders before returning response
    if (getIsFolderHiddenProperty(folder)) {
        return false;
    }

    // Clutter folder cant be deleted if it is a distinguished folder. We have seen it not being a
    // distinguished folder, which users can actually remove if it bothers them.
    // In case it is distinguished and has no item in it, just hide it
    if (folder.DistinguishedFolderId === 'clutter' && folder.TotalCount === 0) {
        // Skip adding clutter folder if it has no items in it
        return false;
    }

    // Add junkemail to the folder hierarchy list if client supports showing junkemail folder
    if (folder.DistinguishedFolderId === 'junkemail') {
        return !!shouldShowJunkEmailFolder;
    }

    // Add notes to the folder hierarchy list if client supports showing notes folder
    if (folder.DistinguishedFolderId === 'notes') {
        return !!shouldShowNotesFolder;
    }

    return true;
}

export function mapOWSFolderToGql(
    folder_0: BaseFolderType,
    mailboxInfo: MailboxInfo
): Schema.MailFolder | null {
    const folder = folder_0 as FolderType;
    const {
        FolderId,
        ParentFolderId,
        DisplayName,
        ArchiveTag,
        PolicyTag,
        ChildFolderCount,
        UnreadCount,
        TotalCount,
        FolderClass,
        DistinguishedFolderId,
    } = folder;
    if (!FolderId || !ParentFolderId) {
        trace.warn(
            'mapOWSFolderToGql: ignoring folder with missing folderId or missing parentFolderId'
        );
        return null;
    }
    const numOfChildFolders = ChildFolderCount || 0;
    const folderId = mapFolderId(FolderId);
    const replicaList = getReplicaListProperty(folder);
    return {
        id: folderId.Id,
        __typename: 'MailFolder',
        type: folder.__type,
        FolderId: folderId,
        ParentFolderId: mapFolderId(ParentFolderId),
        DisplayName: DisplayName || '',
        DistinguishedFolderId: DistinguishedFolderId || null,
        FolderClass: FolderClass || 'IPF.Note',
        UnreadCount: UnreadCount || 0,
        TotalCount: TotalCount || 0,
        ArchiveTag: ArchiveTag ? mapRetentionTagType(ArchiveTag) : null,
        PolicyTag: PolicyTag ? mapRetentionTagType(PolicyTag) : null,
        hasChildren: numOfChildFolders > 0,
        remoteFolderDisplayName: getRemoteFolderDisplayNameProperty(folder),
        sourceWellKnownFolderType: getSourceWellKnownFolderTypeProperty(folder),
        ReplicaList: replicaList,
        PermissionSet: folder.PermissionSet,
        size: getFolderSize(folder),
        pausedTotalCount: null,
        principalSMTPAddress: null,
        mailboxInfo: {
            type: mailboxInfo.type,
            userIdentity: mailboxInfo.userIdentity,
            mailboxSmtpAddress: mailboxInfo.mailboxSmtpAddress,
            auxiliaryMailboxGuid: replicaList?.[0],
        },
    };
}

function getFolderSize(folder: BaseFolderType): string {
    // ExtendedProperty[0] is the size of the folder. i.e 10MB, Value gives the size in bytes.
    return folder.ExtendedProperty?.[0]?.Value;
}

function mapFolderId(folderId: FolderId): Schema.FolderId {
    return {
        // TODO: 90949 skip separate object caching for FolderId
        __typename: 'FolderId',
        Id: (folderId as FolderId).Id,
        ChangeKey: (folderId as FolderId).ChangeKey,
    };
}

function mapRetentionTagType(tagType: RetentionTagType): Schema.RetentionTagType {
    return {
        __typename: 'RetentionTagType',
        IsExplicit: !!tagType.IsExplicit,
        Value: tagType.Value,
    };
}
