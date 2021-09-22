import { getStore } from '../store/store';
import { getUserConfiguration } from 'owa-session-store';
import type { UploadFolder } from '../store/schema/UploadFolder';

export function getUploadFolder(
    mailboxId: string = getUserConfiguration().SessionSettings.UserEmailAddress
): UploadFolder | null {
    const store = getStore();
    return store.uploadFolders.get(mailboxId) || null;
}
