import type { MailboxInfo } from 'owa-client-ids';
import { getIsSearchTableShown } from 'owa-mail-list-store';
import { isFolderUnderArchiveRoot } from 'owa-mail-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { isFolderInMailboxType } from 'owa-folders';

export default function doesTableSupportUndo(
    sourceFolderId: string,
    mailboxInfo: MailboxInfo
): boolean {
    return !!(
        (
            sourceFolderId &&
            !getIsSearchTableShown() &&
            mailboxInfo &&
            mailboxInfo.type === 'UserMailbox' &&
            !isFolderUnderArchiveRoot(sourceFolderId) &&
            sourceFolderId != folderNameToId('recoverableitemsdeletions') &&
            !isFolderInMailboxType(sourceFolderId, 'SharedMailbox')
        ) /* shared folder items do not support undo */
    );
}
