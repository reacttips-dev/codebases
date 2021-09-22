import { action } from 'satcheljs';
import type BaseFolderType from 'owa-service/lib/contract/BaseFolderType';
import type { PublicFolder } from '../store/publicFolderTable';
import type { MailboxInfo } from 'owa-client-ids';

export let addFolderToPublicFolderTable = action(
    'addFolderToPublicFolderTable',
    (item: BaseFolderType, mailboxInfo: MailboxInfo) => {
        return {
            item,
            mailboxInfo,
        };
    }
);

export let addRootFolderToPublicFolderTable = action(
    'addRootFolderToPublicFolderTable',
    (rootFolder: PublicFolder, mailboxInfo: MailboxInfo) => {
        return {
            rootFolder,
            mailboxInfo,
        };
    }
);

export let clearPublicFolderTable = action('clearPublicFolderTable', () => {
    return {};
});
