import { action } from 'satcheljs';
import type { MailboxInfo } from 'owa-client-ids';

export const onNewFolderNotification = action(
    'onNewFolderNotification',
    (
        folderId: string,
        parentFolderId: string,
        displayName: string,
        unreadCount: number = 0,
        totalCount: number = 0,
        mailboxInfo?: MailboxInfo
    ) => ({
        folderId,
        parentFolderId,
        displayName,
        unreadCount,
        totalCount,
        mailboxInfo,
    })
);

export const onUpdateFolderNotification = action(
    'onUpdateFolderNotification',
    (
        unreadCount: number,
        totalCount: number,
        folderId: string,
        displayName: string,
        parentFolderId: string
    ) => {
        return {
            unreadCount,
            totalCount,
            folderId,
            displayName,
            parentFolderId,
        };
    }
);
