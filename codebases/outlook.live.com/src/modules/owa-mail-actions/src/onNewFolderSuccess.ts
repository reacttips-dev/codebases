import { action } from 'satcheljs';
import type { MailboxInfo } from 'owa-client-ids';

export const onNewFolderSuccess = action(
    'onNewFolderSuccess',
    (folderId: string, parentFolderId: string, displayName: string, mailboxInfo: MailboxInfo) => ({
        folderId,
        parentFolderId,
        displayName,
        mailboxInfo,
    })
);
