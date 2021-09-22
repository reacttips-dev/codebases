import doesFolderIdEqualName from 'owa-session-store/lib/utils/doesFolderIdEqualName';
import {
    PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID,
    ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID,
} from 'owa-folders-constants';

/**
 * Use isDeletedItemsFolderFromAnyMailboxV2 instead
 * Utility to check whether a folder is deleted items folder for any mailbox
 * @param folderId - the folderId.Id property of the folder
 * VSO-108969 - Remove isDeletedItemsFolderFromAnyMailbox and use V2  based in distinguishedFolderIds
 */
export default function isDeletedItemsFolderFromAnyMailbox(folderId: string): boolean {
    return (
        folderId &&
        (doesFolderIdEqualName(folderId, PRIMARY_DELETED_ITEMS_DISTINGUISHED_ID) ||
            doesFolderIdEqualName(folderId, ARCHIVE_DELETED_ITEMS_DISTINGUISHED_ID))
    );
}
