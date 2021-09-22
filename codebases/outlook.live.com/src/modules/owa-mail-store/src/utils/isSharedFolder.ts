import { isFolderInMailboxType } from 'owa-folders';

export default function isSharedFolder(folderId: string): boolean {
    return isFolderInMailboxType(folderId, 'SharedMailbox');
}
