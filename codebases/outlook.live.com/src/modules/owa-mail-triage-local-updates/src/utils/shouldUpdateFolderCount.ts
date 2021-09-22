import { isFolderInMailboxType } from 'owa-folders';

/**
 * Helper to determine if we should update the folder unread/total count
 * @param folderId
 */
export default function shouldUpdateFolderCount(folderId: string) {
    // For archive mailbox and shared folders hierarchy notifications are disabled, so we should update the count
    return (
        isFolderInMailboxType(folderId, 'ArchiveMailbox') ||
        isFolderInMailboxType(folderId, 'SharedMailbox')
    );
}
