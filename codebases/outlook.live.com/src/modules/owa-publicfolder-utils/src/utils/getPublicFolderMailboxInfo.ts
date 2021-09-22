import { mutatorAction } from 'satcheljs';
import type { MailboxInfo } from 'owa-client-ids';
import publicFolderFavoriteStore from 'owa-public-folder-favorite/lib/store/publicFolderFavoriteStore';
import getPublicFolderMailboxInfoForSmtpAddress from 'owa-public-folder-favorite/lib/services/utils/getPublicFolderMailboxInfoForSmtpAddress';
import getStore from '../store/store';
import { getUserConfiguration } from 'owa-session-store';

export default function getPublicFolderMailboxInfo(folderId: string): MailboxInfo {
    if (!getStore().has(folderId)) {
        const sourceFolder = publicFolderFavoriteStore.folderTable.get(folderId);
        const publicFolderMailbox =
            sourceFolder.ReplicaList != undefined
                ? sourceFolder.ReplicaList[0]
                : getUserConfiguration().SessionSettings.DefaultPublicFolderMailbox;

        const publicFolderMailboxInfo = getPublicFolderMailboxInfoForSmtpAddress(
            publicFolderMailbox
        );
        addToStore(folderId, publicFolderMailboxInfo);
    }

    return getStore().get(folderId);
}

const addToStore = mutatorAction(
    'addPublicFolderMailboxInfoToStore',
    (folderId: string, publicFolderMailboxInfo: MailboxInfo) => {
        getStore().set(folderId, publicFolderMailboxInfo);
    }
);
