import { mutatorAction } from 'satcheljs';
import type { MailboxFolderTreeData } from '../store/schema/FolderStore';
import getStore from '../store/store';

export const setMailboxFolderTreeData = mutatorAction(
    'setMailboxFolderTreeData',
    (userIdentity: string, mailboxFolderTreeData: MailboxFolderTreeData) => {
        getStore().mailboxFolderTreeData.set(userIdentity, mailboxFolderTreeData);
    }
);
