import { action } from 'satcheljs';
import { getUserConfiguration } from 'owa-session-store';
import { UploadFolder, UploadFolderMailboxType } from '../store/schema/UploadFolder';

export const preloadUploadFolder = action(
    'preloadUploadFolder',
    (
        mailboxId: string = getUserConfiguration().SessionSettings.UserEmailAddress,
        uploadFolderMailboxType: UploadFolderMailboxType = UploadFolderMailboxType.User
    ) => ({ mailboxId, uploadFolderMailboxType })
);

export const uploadFolderLoaded = action(
    'uploadFolderLoaded',
    (mailboxId: string, uploadFolder: UploadFolder) => ({
        mailboxId,
        uploadFolder,
    })
);
